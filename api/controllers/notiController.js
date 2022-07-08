module.exports = {
  createNotification: (req, res) => {
    console.log("Create notification....");
    res.status(200).send("Create notification");
  }
}