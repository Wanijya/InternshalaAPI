const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentModel = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "First name should be atleast 4 character long"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [4, "Last name should be atleast 4 character long"],
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      maxLength: [10, "Contact must not exceed 10 character"],
      minLength: [10, "Contact should be atleast 10 character long"],
    },
    city: {
      type: String,
      required: [true, "City Name is required"],
      minLength: [3, "Cityt should be atleast 3 character long"],
    },
    gender: { type: String, enum: ["Male", "Female", "Others"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "Password should not exceed more than 15 characters"],
      minLength: [6, "Password should have atleast more 6 characters"],
      // match: [],
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    avatar: {
      type: Object,
      default: {
        fileId: "",
        url: "https://imgs.search.brave.com/3tKXrQ4ggFpTB4QIx82z_ztBUjSN1zaqKDxj0omgXhA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90b3Bw/bmcuY29tL3VwbG9h/ZHMvcHJldmlldy9p/bnN0YWdyYW0tZGVm/YXVsdC1wcm9maWxl/LXBpY3R1cmUtMTE1/NjI5NzMwODNicnlj/ZWhybXl2LnBuZw",
      },
    },
    resume: {
      education: [],
      jobs: [],
      internships: [],
      responsibilities: [],
      courses: [],
      projects: [],
      skills: [],
      accomplishments: [],
    },
  },
  { timestamps: true }
);

studentModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

studentModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

studentModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Student = mongoose.model("student", studentModel);

module.exports = Student;
