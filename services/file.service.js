// eslint-disable-next-line
const { Attachment, sequelize } = require("../core/db.sequelizer");
// eslint-disable-next-line
const { QueryTypes } = require("sequelize");

const attachmentAttributes = ["id", "uuid", "name", "path"];

module.exports.createAttachment = async (attachmentInfo) => {
  const attachment = await Attachment.create(attachmentInfo);

  return attachment;
};

module.exports.findAttachmentByUuid = async (attachmentUuid) => {
  if (!attachmentUuid) {
    return false;
  }

  const condition = {
    uuid: attachmentUuid,
  };

  const attachment = await Attachment.findOne({
    attributes: attachmentAttributes,
    where: condition,
  });

  return attachment;
};
