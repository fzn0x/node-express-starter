const path = require("path");
const uuid = require("uuid");

const {
  createAttachment,
  findAttachmentByUuid,
} = require("../services/file.service");

module.exports.uploadFile = (req, res) => {
  let image = req.files.image;
  const uuidv4 = uuid.v4();
  let imageExtension = image.name.split(".").slice(1).join(".");
  let uploadPath = path.resolve(
    __dirname,
    "../files",
    `${uuidv4}.${imageExtension}`
  );

  image.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    try {
      await createAttachment({
        uuid: uuidv4,
        name: image.name,
        path: uploadPath,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }

    return res.json({
      success: true,
      message: `File uploaded to ${uploadPath}`,
      data: uuidv4,
    });
  });
};

module.exports.getFile = async (req, res) => {
  try {
    const attachment = await findAttachmentByUuid(req.params.uuid);

    if (attachment) {
      return res.sendFile(attachment.path);
    }

    return res.status(422).json({
      success: attachment,
      message: "No attachment found!",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
