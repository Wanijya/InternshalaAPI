const mongoose = require("mongoose");

const jobModel = new mongoose.Schema(
  {
    title: String,
    skill: String,
    jobtype: { type: String, emum: ["In office", "Remote"] },
    openings: Number,
    description: String,
    preferences: String,
    salary: Number,     
    perks: String,
    assesments: String,
  },
  { timestamps: true }
);



const Job = mongoose.model("job", jobModel);

module.exports = Job;
