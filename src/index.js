import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import '@contentful/forma-36-react-components/dist/styles.css';
// import { RichTextEditor, renderRichTextDialog } from '@contentful/field-editor-rich-text';
import { RichTextEditor, renderRichTextDialog } from './rich-text/src';
import { init, locations } from 'contentful-ui-extensions-sdk';
// import '@contentful/forma-36-react-components/dist/styles.css';
// import 'codemirror/lib/codemirror.css';
import './index.css';

export const App = ({ sdk }) => {
  // console.log('here', sdk);
  const [value, setValue] = useState(sdk.field.getValue() || '');

  const onExternalChange = (value) => {
    setValue(value);
  };

  const onChange = (e) => {
    const value = e.currentTarget.value;
    setValue(value);
    if (value) {
      sdk.field.setValue(value);
    } else {
      sdk.field.removeValue();
    }
  };

  // sdk.window.startAutoResizer();

  useEffect(() => {
    // console.log('update height');
    // sdk.window.updateHeight(1000);
    sdk.window.startAutoResizer();
  }, [sdk]);

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detatchValueChangeHandler;
  });

  return (
    <div>
      <RichTextEditor sdk={sdk} value={value} onChange={onChange} />
    </div>
  );
};

App.propTypes = {
  sdk: PropTypes.object.isRequired,
};

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(renderRichTextDialog(sdk), document.getElementById('root'));
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
