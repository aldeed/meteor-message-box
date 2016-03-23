import Handlebars from 'handlebars';
import deepExtend from 'deep-extend';

MessageBox = class {
  constructor({
    initialLanguage,
    messages,
  } = {}) {
    this._language = new ReactiveVar(initialLanguage || MessageBox._language || 'en');
    this._messages = messages || {};
  }

  messages(messages) {
    deepExtend(this._messages, messages);
  }

  _getMessages({
    language,
    fieldName,
  }) {
    language = language || this._language.get();

    const globalMessages = MessageBox._messages[language];

    let messages = this._messages[language];
    if (messages) {
      if (globalMessages) messages = deepExtend({}, globalMessages, messages);
    } else {
      messages = globalMessages;
    }

    if (!messages) throw new Error(`No messages found for language "${language}"`);

    return {
      messages,
      language,
    };
  }

  message(errorInfo, {
    language,
    context,
  } = {}) {
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
    }, context, errorInfo);

    if (_.isObject(message) && typeof message !== 'function') message = message[genericName] || message._default;

    if (typeof message === 'string') message = Handlebars.compile(message);

    if (typeof message !== 'function') return `${fieldName} is invalid`;

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
  } = {}) {
    if (typeof initialLanguage === 'string') MessageBox._language = initialLanguage;

    if (messages) {
      if (!MessageBox._messages) MessageBox._messages = {};
      deepExtend(MessageBox._messages, messages);
    }
  }
};
