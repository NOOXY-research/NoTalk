// NoService/services/youservice/entry.js
// Description:
// "youservice/entry.js" description.
// Copyright 2018 NOOXY. All Rights Reserved.

let NoTalk = require('./NoTalk');
let fs = require('fs');

function Service(Me, api) {
  // Your service entry point
  // Get the service socket of your service
  let ss = api.Service.ServiceSocket;
  // BEWARE! To prevent callback error crash the system.
  // If you call an callback function which is not API provided. Such as setTimeout(callback, timeout).
  // You need to wrap the callback funciton by api.SafeCallback.
  // E.g. setTimeout(api.SafeCallback(callback), timeout)
  let safec = api.SafeCallback;
  // Please save and manipulate your files in this directory
  let files_path = Me.FilesPath;
  // Your settings in manifest file.
  let settings = Me.Settings;

  let notalk = new NoTalk(Me, api);


  // Your service entry point
  this.start = ()=> {
    notalk.launch((err)=> {
      if(err) {
        console.log(err);
      }
      else {
        ss.def('getMyMeta', (json, entityId, returnJSON)=> {
          api.Authorization.Authby.Token(entityId, (err, valid)=> {
            if(valid) {
              api.Service.Entity.getEntityOwner(entityId, (err, r)=>{
                api.Authenticity.getUserID(r, (err, id)=>{
                  notalk.getUserMeta(id, (err, meta)=> {
                    meta.n = r;
                    returnJSON(false, meta);
                  });
                });
              });
            }
            else {
              returnJSON(false, {});
            }
          });
        });

        ss.def('updateMyMeta', (json, entityId, returnJSON)=> {
          api.Authorization.Authby.Token(entityId, (err, valid)=> {
            if(valid) {
              api.Service.Entity.getEntityOwner(entityId, (err, r)=>{
                api.Authenticity.getUserID(r, (err, id)=>{
                  notalk.updateUserMeta(id, json, (err)=> {
                    if(err) {
                      returnJSON(false, {s:err});
                    }
                    else {
                      returnJSON(false, {s:'OK'});
                    }
                  });
                });
              });
            }
            else {
              returnJSON(false, {s: 'Auth failed'});
            }
          });
        });
      }
    });
  }

  // If the daemon stop, your service recieve close signal here.
  this.close = ()=> {

  }
}

// Export your work for system here.
module.exports = Service;
