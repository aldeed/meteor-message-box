const Handlebars = Npm.require('handlebars');
const deepExtend = Npm.require('deep-extend');

MessageBox = class {
  constructor({
    initialLanguage,
    messages,
  }) {
    this._language = new ReactiveVar(initialLanguage || MessageBox._language || 'en');
    this._messages = messages;
  }

  _getMessages({
    language,
    fieldName,
  }) {
    language = language || this._language.get();

    const messages = this._messages[language] || MessageBox._messages[language];
    if (!messages) throw new Error(`No messages found for language "${language}"`);

    return {
      messages,
      language,
    };
  }

  message(errorInfo, {
    language,
    context,
  }) {
    // Error objects can optionally include a preformatted message,
    // in which case we use that.
    if (errorInfo.message) return errorInfo.message;

    const fieldName = errorInfo.name;
    const genericName = MessageBox._makeNameGeneric(fieldName);

    let {
      messages,
    } = this._getMessages({language, fieldName});

    let message = messages[errorInfo.type];

    const fullContext = _.extend({
      genericName,
      label,
    }, context, errorInfo);

    if (_.isObject(message)) message = message[genericName] || message._default;

    if (typeof message === 'string') message = Handlebars.compile(message)(fullContext);

    if (typeof message !== 'function') return `${name} is invalid`;

    return message(fullContext);
  }

  setLanguage(language) {
    this._language.set(language);
  }

  static _makeNameGeneric(name) {
    if (typeof name !== 'string') return null;
    return name.replace(/\.[0-9]+(?=\.|$)/g, '.$');
  }

  static defaults({
    initialLanguage,
    messages,
  }) {
    if (typeof initialLanguage === 'string') MessageBox._language = initialLanguage;

    if (messages) {
      if (!MessageBox._messages) MessageBox._messages = {};
      deepExtend(MessageBox._messages, messages);
    }
  }
};
