const { db } = require('../util/admin')


exports.getAllAlerts = (req, res) => {
  db
    .collection('alerts')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let alerts = []
      data.forEach(doc => { // doc = a document reference
        alerts.push({
          alertId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
        }) // data() is a function that returns the data within the document
      })
      return res.json(alerts)
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong '}) // note: changes status code from 200
      console.error(err)
    })
}

exports.postOneAlert = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' })
  }

  const newAlert = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(), // recognised time type
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  } 

  db
    .collection('alerts')
    .add(newAlert)
    .then((doc) => {
      const resAlert = newAlert
      resAlert.alertId = doc.id
      res.json(resAlert)
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong '}) // note: changes status code from 200
      console.error(err)
    })
}

exports.getAlert = (req, res) => {
  let alertData = {}
  db.doc(`/alerts/${req.params.alertId}`).get() // returns doc
  .then(doc => {
    if(!doc.exists){
      return res.status(404).json({ error: 'Alert not found' })
    } 
    // returns alert 
    alertData = doc.data()
    alertData.alertId = doc.id
    
    return db.collection('comments')
             .orderBy('createdAt', 'desc')
             .where('alertId', '==', req.params.alertId)
             .get()
  })
  .then(data => {
    alertData.comments = []
    data.forEach(comment => {
      alertData.comments.push(comment.data())
    })
    return res.json(alertData)
  })
  .catch(err => {
    console.error(err)
    res.status(500).json({ error: err.code })
  })
}

exports.commentOnAlert = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' })
  // build comment
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    alertId: req.params.alertId,
    userHandle: req.user.handle, // from middleware 
    userImage: req.user.imageUrl
  }
  // check alert exists
  db.doc(`/alerts/${req.params.alertId}`)
    .get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ comment: 'Alert not found' })
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
    })
    .then(() => {
      return db.collection('comments').add(newComment)
    })
    .then(() => {
      //return comment to front end
      res.json(newComment)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: 'Something went wrong' })
    })
}

exports.likeAlert = (req, res) => {
  // check to see if alert already liked & check if alert exists
  const likeDocument = db.collection('likes')
                        .where('userHandle', '==', req.user.handle)
                        .where('alertId', '==', req.params.alertId)
                        .limit(1) // will return arr with 1x doc
  const alertDocument = db.doc(`/alerts/${req.params.alertId}`)

  let alertData

  alertDocument
    .get()
    .then(doc => {
      if(doc.exists){
        alertData = doc.data()
        alertData.alertId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Alert not found' })
      }
    })
    .then(data => {
      if(data.empty){
        return db.collection('likes').add({
          alertId: req.params.alertId,
          userHandle: req.user.handle
        })
        // cant do a return then handle the promise in the next .then() because if it's
        // not empty it may go through so we need to nest the then inside the if block
        .then(() => {
          alertData.likeCount++
          return alertDocument.update({ likeCount: alertData.likeCount })
        })
        .then(() => {
          return res.json(alertData) // success!
        })
      } else { // user has already liked this alert
        return res.status(400).json({ error: 'Alert already liked' })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.unlikeAlert = (req, res) => {
  // check to see if alert already liked & check if alert exists
  const likeDocument = db.collection('likes')
                        .where('userHandle', '==', req.user.handle)
                        .where('alertId', '==', req.params.alertId)
                        .limit(1) // will return arr with 1x doc
  const alertDocument = db.doc(`/alerts/${req.params.alertId}`)

  let alertData

  alertDocument
    .get()
    .then(doc => {
      if(doc.exists){
        alertData = doc.data()
        alertData.alertId = doc.id
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Alert not found' })
      }
    })
    .then(data => {
      if(data.empty){
        return res.status(400).json({ error: 'Alert not liked' })
      } else { 
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            alertData.likeCount--
            return alertDocument.update({ likeCount: alertData.likeCount })
          })
          .then(() => {
            res.json(alertData)
          })
      }
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.deleteAlert = (req, res) => {
  const document = db.doc(`/alerts/${req.params.alertId}`)
  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Alert not found' })
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unauthorized' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      res.json({ message: 'Alert deleted successfully' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}