class SlackError extends Error {
  constructor(message) {
    super(message.error);
    this.name = this.constructor.name;
    this.extra = message.response_metadata.messages;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = SlackError;