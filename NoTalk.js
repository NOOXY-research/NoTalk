// NoTalk.js
// Description:
// "NoTalk.js" NOOXY Talk Service.
// Copyright 2018 NOOXY. All Rights Reserved.


let sqlite3 = require('sqlite3');
let Utils = require('./utilities');

function NoTalkDB() {
  let _database = null;

  function User() {

    this.loadbyUserIdsql = (userid, next) => {
      // sql statement
      let sql = 'SELECT UserId, Bio, ShowActive, LatestOnline, Joindate FROM User WHERE UserId = ?';

      _database.get(sql, [userid], (err, row) => {
        if(err || typeof(row) == 'undefined') {
          this.UserId = userid;
          this.exisitence = false;
        }
        else {
          this.exisitence = true;
          this.UserId = row.UserId;
          this.Bio = row.Bio;
          this.ShowActive = row.ShowActive;
          this.LatestOnline = row.LatestOnline;
          this.JoinDate = row.JoinDate;
        }
        next(false);
      })

    };

    // write newest information of user to database.
    this.updatesql = (callback) => {
      let sql = null;
      let err = null;
      if(typeof(this.UserId)=='undefined') {
        callback(new Error('userid undefined.'));
      }
      else {
        let datenow = Utils.DatetoSQL(new Date());
        if(this.exisitence) {
          sql = 'UPDATE User SET Bio=?, ShowActive=?, LatestOnline=? WHERE UserId=?';
          _database.run(sql, [this.Bio, this.ShowActive, this.LatestOnline, this.UserId], (err) => {
            if(err) {
              callback(err);
            }
            else {
              this.exisitence = true;
              callback(false);
            }
          });
        }
        else {
          sql = 'INSERT INTO User(UserId, Bio, ShowActive, LatestOnline, JoinDate) VALUES (?, ?, ?, ?, ?);'
          _database.run(sql, [this.UserId, this.Bio, this.ShowActive, this.LatestOnline, datenow], (err) => {
            if(err) {
              callback(err);
            }
            else {
              this.exisitence = true;
              callback(false);
            }
          });
        }
      }
    };

    // delete the user from database.
    this.delete = (callback) => {
      _database.run('DELETE FROM User WHERE UserId=?;', [this.UserId], callback)
      this.exisitence = false;
    };
  }

  function Channel() {

    this.loadbyChIdsql = (ChId, next) => {
      // sql statement
      let sql = 'SELECT ChId, Type, Description, Visability,'+
      ' CreateDate, ModifyDate, Displayname, Status,'+
      ' Thumbnail, Lines, CreatorId FROM ChMeta WHERE ChId = ?';

      _database.get(sql, [userid], (err, row) => {
        if(err || typeof(row) == 'undefined') {
          this.ChId = ChId;
          this.exisitence = false;
        }
        else {
          this.exisitence = true;
          this.ChId = row.ChId;
          this.Type = row.Bio;
          this.Description = row.ShowActive;
          this.Visability = row.LatestOnline;
          this.CreateDate = row.JoinDate;
          this.ModifyDate = row.ModifyDate;
          this.Displayname = row.Displayname;
          this.Status = row.Status;
          this.Thumbnail = row.Thumbnail;
          this.Lines = row.Lines;
          this.CreatorId = row.CreatorId;
        }
        next(false);
      })

    };

    // write newest information of user to database.
    this.updatesql = (callback) => {
      let sql = null;
      let err = null;
      if(typeof(this.UserId)=='undefined') {
        callback(new Error('userid undefined.'));
      }
      else {
        let datenow = Utils.DatetoSQL(new Date());
        if(this.exisitence) {
          let sql = 'UPDATE ChMeta SET Type=? Description=? Visability=?'+
          ' CreateDate=? ModifyDate=? Displayname=? Status=?'+
          ' Thumbnail=? Lines=? CreatorId=?  WHERE ChId = ?';
          _database.run(sql, [this.Type, this.Description, this.Visability,
             this.CreateDate, datenow, this.Displayname, this.Status,
           this.Thumbnail, this.Lines, this.CreatorId, this.ChId], (err) => {
            if(err) {
              callback(err);
            }
            else {
              this.exisitence = true;
              callback(false);
            }
          });
        }
        else {
          sql = 'INSERT INTO User(ChId, Type, Description, Visability,'+
          ' CreateDate, ModifyDate, Displayname, Status,'+
          ' Thumbnail, Lines, CreatorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
          _database.run(sql, [this.ChId, this.Type, this.Description,
             this.Visability, datenow, datenow, this.Displayname, this.Status,
           this.Thumbnail, this.Lines, this.CreatorId], (err) => {
            if(err) {
              callback(err);
            }
            else {
              this.exisitence = true;
              callback(false);
            }
          });
        }
      }
    };

    // delete the user from database.
    this.delete = (callback) => {
      _database.run('DELETE FROM User WHERE UserId=?;', [this.UserId], callback)
      this.exisitence = false;
    };
  }

  this.createDatabase = (path) => {
    _database = new sqlite3.Database(path);
    // Main (Main)
    _database.run('CREATE TABLE Main(LatestChId INT)');
    // User relation (UserRel)
    _database.run('CREATE TABLE UserRel(UserId TEXT, ToUserId TEXT, Type INT)');
    // Channel/user pair (ChUserPair)
    _database.run('CREATE TABLE ChUserPair(UserId TEXT, ChId INT, Permition INT, LatestRLn INT, JoinDate DATE, Addedby TEXT, Mute INT)');
    // Channel meta (ChMeta)
    _database.run('CREATE TABLE ChMeta(ChId INT, Type INT, Description TEXT, Visability INT,'+
    ' CreateDate DATE, ModifyDate DATE, Displayname TEXT, Status INT,'+
    ' Thumbnail TEXT, Lines INT, CreatorId TEXT)');
    // User (User)
    _database.run('CREATE TABLE User(UserId TEXT, JoinDate DATE, Bio TEXT, ShowActive INT, ClientPreference TEXT, LatestOnline DATE)');
    // Messege(Messege)
    _database.run('CREATE TABLE Messege(ChId INT, Line INT, UserId TEXT, Type INT, Contain TEXT, TimeStamp DATE, Detail TEXT)');
  };

  this.importDatabase = (path) => {
    _database = new sqlite3.Database(path);
  };

  this.close = ()=>{
    _database.close();
    _database = null;
  };

  this.getUserbyId = (userid, callback) => {
    let user = new User();
    user.loadbyUserIdsql(userid, (err)=>{
      callback(err, user);
    });
  };

  this.getChannelbyId = (userid, callback) => {
    let ch = new Channel();
    ch.loadbyChIdsql(userid, (err)=>{
      callback(err, user);
    });
  };

  this.getMessegesbyChIdnLn = ()=> {

  };

  this.getChUserPairsbyUserId = ()=> {

  };

  this.getChUserPairsbyChId = ()=> {

  };

  this.updateChUserPairs = (pairs, callback)=> {
    let key = 0;
    let loop = ()=> {
      let sql = "INSERT OR IGNORE INTO ChUserPair(UserId, ChId) VALUES();"+
      "UPDATE ChUserPair SET =? WHERE UserId=? AND ChId=?";
    }
    loop();
  };

  this.deleteChUserPairbyChId = ()=> {

  };

  this.deleteChUserPairbyUserIdandChId = ()=> {

  }
};

function NoTalk() {
  const _nouserdb = new NoTalkDB();
  // import database from specified path
  this.importDatabase = (path) => {
    _nouserdb.importDatabase(path);
  };

  // create a new database for nouser.
  this.createDatabase = (path) => {
    _nouserdb.createDatabase(path);
  };

  // create a channel
  this.createChannel = (meta, callback)=> {
    let uuid = Utils.generateGUID();
    // update channel metatdata
    _nouserdb.getChannelbyId(uuid, (err, channel)=> {
      channel.ChId = uuid;
      channel.Type = meta.t;
      channel.Description = meta.d;
      channel.Visability = meta.v;
      channel.Displayname = meta.n;
      channel.Status = 0;
      channel.Thumbnail = meta.p; // abrev photo
      channel.Lines = 0;
      channel.CreatorId = meta.c;
      channel.updatesql((err)=> {
        if(err) {
          callback(err);
        }
        else {
          // add user into channel
          let chuserspair = [[meta.c, uuid, 0, 0, meta.c, false]];
          for(let key in meta.u) {
            // userid, chid, permition, latestrln, addedby, mute
            chuserspair.push([meta.u[key], uuid, 1, 0, meta.c, false]);
          }
          _nouserdb.updateChUserPairs(chuserspair, callback);
        }
      });
    });
  }

  // get NoUserdb's meta data.
  this.getUserMeta = (userid, callback)=> {
    _nouserdb.getUserbyId(userid, (err, user) => {
      let user_meta = {
        i: user.UserId,
        b: user.Bio,
        a: user.ShowActive,
        l: user.LatestOnline,
        j: user.JoinDate
      }
      callback(false, user_meta);
    });
  }

  // get NoUserdb's meta data.
  this.updateUserMeta = (userid, meta, callback)=> {
    _nouserdb.getUserbyId(userid, (err, user) => {
      user.Bio = meta.b;
      user.updatesql(callback);
    });
  }
};

module.exports = NoTalk;
