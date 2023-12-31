var userdb = require("../model/model");
var Stuser = require("../model/stuModel");
var Slogintuser = require("../model/stuLogin");
var Subjectsatt = require("../model/subjects.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Stloginuser = require("../model/stuLogin");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "fill all details" });

  }
  try {
    const userExists = await userdb.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "User already exists" });
    }
    const user = new userdb({
      name,
      email,
      password,
    });
    const signUp = await user.save();
    if (signUp) {
      res.status(201).json({ message: "Registration Successful" });
    } else {
      res.status(400).json({ error: "Registration Failed" });
    }
  } catch (err) {
   
  }
};

exports.changepassword = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Data to be updated cannot be empty" });
  }

  const email = req.body.email;
  const cp = req.body.cp;
  const pp = req.body.pp;

  try {
    const emailExists = await userdb.findOne({ email: email });
    if (emailExists) {
      const PassMatch = await bcrypt.compare(pp, emailExists.password);

      if (!PassMatch) {
        return res
          .status(400)
          .json({ error: "Please Enter valid User Credentials" });
      }

      userdb.findByIdAndUpdate(
        emailExists._id,
        { password: await bcrypt.hash(cp, 12) },
        { new: true }, 
        (error, data) => {
          if (error) {
            return res.status(400).json({ error: "Error updating password" });
          } else {
            return res
              .status(201)
              .json({ message: "Password Changed Successfully" });
          }
        }
      );
    } else {
      res.status(400).json({ error: "Email doesn't exist" });
    }
  } catch (err) {
   
  }

};



exports.changepasswordstu = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Data to be updated cannot be empty" });
  }

  const email = req.body.email;
  const cp = req.body.cp;
  const pp = req.body.pp;
 

  try {
    const emailExists = await Slogintuser.findOne({ email: email });
    if (emailExists) {
     


      if (emailExists.phone!=pp) {
        return res
          .status(400)
          .json({ error: "Please Enter valid User Credentials" });
      }

      Stloginuser.findByIdAndUpdate(
        emailExists._id,
        {  phone : cp },
        { new: true }, 
        (error, data) => {
          if (error) {
            return res.status(400).json({ error: "Error updating password" });
          } else {
            return res
              .status(201)
              .json({ message: "Password Changed Successfully" });
          }
        }
      );
    } else {
      res.status(400).json({ error: "Email doesn't exist" });
    }
  } catch (err) {
    
  }
};





exports.stucreate = async (req, res) => {
  try {
    const { name, email, phone, roll, branch, subject } = req.body;
    if (!name || !email || !phone || !roll || !subject || !branch) {
      return res.status(422).json({ error: "fill in all details" });
    } else {
      
      Stuser.findOne({ email: email })
        .then((userexists) => {
          if (userexists) {
            Stuser.findOneAndUpdate(
              { email: email },
              { $addToSet: { subject: subject } },
              (error, data) => {
                if (error) {
                
                } else {
                 
                }
              }
            );

            Slogintuser.updateOne(
              { email: email },
              { $set: { [subject]: [] } },
              { upsert: false, multi: true },
              (error, data) => {
                if (error) {
                 
                } else {
                
                }
              }
            );

            return res.status(201).json({ message: "Registration Successful" });
          }

          const stuser = new Stuser({
            name: name,
            email: email,
            phone: phone,
            roll: roll,
            subject: [subject],
            branch: branch,
          });

          stuser
            .save()
            .then(() => {
              const stloginuser = new Slogintuser({
                email: email,
                phone: phone,
                [subject]: [],
              });
              stloginuser
                .save()
                .then(() => {
                  return res
                    .status(201)
                    .json({ message: "student successfully added" });
                })
                .catch((err) =>
                  res.status(500).json({
                    error: "Failed in adding student to student login database",
                  })
                );
            })
            .catch((err) =>
              res.status(500).json({ error: "Failed in adding student" })
            );
        })
        .catch((err) => {
        
        });
    }
  } catch (err) {
   
  }
};

exports.AbsentDates = async (req, res) => {
  try {
    const { email, subjectName, datee } = req.body;
    if (!email || !subjectName || !datee) {
      res.status(422).json({ error: "fill in all details" });
      
    } else {
      Slogintuser.findOne({ email: email }).then((StudentExists) => {
        if (StudentExists) {
          Slogintuser.findOneAndUpdate(
            { email: email },
            { $addToSet: { [subjectName]: datee } },
            (error, data) => {
              if (error) {
                
              } else {

              }
            }
          );
          return res
            .status(201)
            .json({ message: "Absent Marked SuccessFully" });
        } else {
          res.status(422).json({ error: "Cannot mark Absent" });
        }
      });
    }
  } catch (error) {

  }
};
exports.find = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
   
      return res.status(400).json({ error: "None of the feilds can be empty" });
    }

    const emailExists = await userdb.findOne({ email: email });

    if (emailExists) {
      const PassMatch = await bcrypt.compare(password, emailExists.password);

      if (!PassMatch) {
        res.status(400).json({ error: "Please Enter valid User Credentials" });
      } else {
        const token = await emailExists.generateAuthToken();
       
        res.json({token });
      }
    } else {
      res.status(400).json({ error: "Please Enter valid User Credentials" });
    }
  } catch (err) {
   
  }
};

exports.findStud = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
 
      return res.status(400).json({ error: "None of the feilds can be empty" });
    }
    const emailExists = await Stuser.findOne({ email: email });
    const PassMatch = await Stuser.findOne({ email: email, phone: password });
  
    if (emailExists && PassMatch) {
      const token = await emailExists.generateAuthToken();
      res.json({token });
    } else {
      res.status(400).json({ error: "Please Enter valid User Credentials" });
    }
  } catch (err) {
    
  }
};

exports.findStudWithFeild = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).json({ err: "Feilds cannot be empty" });
    }

    const subj = req.params.subject;
    const branch = req.params.branch;
    Stuser.find({ subject: subj, branch: branch })
      .then((data) => {
        if (!data) {
          res.status(404).json({ err: "No student with a branch found" });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Some error occurred" });
      });
  } catch (err) {

  }
};

exports.getstlogindetails = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).json({ err: "None of the fields can be empty" });
    }
    const studemail = req.params.email;
    Slogintuser.findOne({ email: studemail })
      .then((data) => {
        if (!data) {
          res.status(400).json({ err: "No Such field found" });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Some error occurred" });
      });
  } catch (err) {
   
  }
};

exports.getsubjectsenrolled = (req, res) => {
  const Studemail = req.params.email;
  try {
    if (!req.body) {
     
    }
    Stuser.findOne({ email: Studemail })
      .then((data) => {
        if (!data) {
          res.status(400).json({ err: "No Subjects found" });
        } else {
          res.send(data);
         
        }
      })
      .catch((err) => {
      
      });
  } catch (err) {
   
  }
};
exports.update = (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .send({ message: "Data to be updated cannot be empty" });
  }
  const id = req.params.id;
  Stuser.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update a user with ${id} , Maybe User not found`,
        });
      } else {
        return res.status(201).send({ message: "success" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user false Information " });
    });
};

exports.updateteacher = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Data to be updated cannot be empty" });
  }
  const id = req.params.id;
  userdb
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update a user with ${id} , Maybe User not found`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user false Information " });
    });
};

exports.AllDates = async (req, res) => {
  try {
    const { subjectName, datee, branch } = req.body;
    if (!subjectName || !datee || !branch) {
      res.status(422).json({ error: "fill in all details" });
    
    } else {
      Subjectsatt.find({ [subjectName + "_" + branch]: { $exists: true } })
        .then((data) => {
          
          if (!data[0]) {
            const newuser = new Subjectsatt({
              [subjectName + "_" + branch]: [datee],
            });
            newuser
              .save()
              .then(() => {
                return res
                  .status(201)
                  .json({ message: "added attendance date to database" });
              })
              .catch((err) => {
                res.status(500).json({
                  error: "Failed in adding attendance date to database",
                });
              });
          } else {
            Subjectsatt.updateOne(
              { [subjectName + "_" + branch]: { $exists: true } },
              { $addToSet: { [subjectName + "_" + branch]: datee } },
              (error, data) => {
                if (error) {
                
                } else {
                 
                }
              }
            );
            return res
              .status(201)
              .json({ message: "added attendance date to database" });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: "Failed in adding attendance date to database",
          });
        });
    }
  } catch (error) {
  
  }
};

exports.findStudbyemail = async (req, res) => {
  try {
    if (!req.body) {
   
      return res.status(404).json({ err: "Feilds cannot be empty" });
    }

    const email = req.params.email;
  
    Stloginuser.find({ email: email })
      .then((data) => {
        if (!data) {
        
          res.status(404).json({ err: "No student with a branch found" });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {

        res.status(500).send({ message: "Some error occurred" });
      });
  } catch (err) {
    
  }
};



exports.totalnoofclasses = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(404).json({ err: "Feilds cannot be empty" });
    }

    const subj = req.params.subject;
    const branch = req.params.branch;
    Subjectsatt.find({ [subj + "_" + branch]: { $exists: true } })
      .then((data) => {
        if (!data) {
          res.status(404).json({ err: "No student with a branch found" });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Some error occurred" });
      });
  } catch (err) {
    
  }
};
