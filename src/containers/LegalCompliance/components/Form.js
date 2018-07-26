import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames/bind'

import { getFeatureConfig } from 'utils/features'

import DocumentExplanation from './DocumentExplanation'
import DocumentField from './DocumentField'

import style from './Form.mod.scss'

const legalComplianceEnabled = getFeatureConfig('legalCompliance')

const cx = classnames.bind(style)

const LegalCompliance = ({
  documents,
  fields,
  showHeading,
  showExplanation,
  applicationName,
  submitButtonClassName,
  submitButtonDisabledClassName,
  submitButtonLabel,
  submitButtonComponent: ButtonComponent,
  disabled,
  onSubmitAcceptedDocs,
}) => {
  if (!legalComplianceEnabled) {
    return (
      <ButtonComponent className={cx(submitButtonClassName)} onClick={() => onSubmitAcceptedDocs()}>
        {submitButtonLabel}
      </ButtonComponent>
    )
  }

  const documentIds = documents.map(doc => doc.id)
  const hasAcceptedAll = documentIds.every(docId => !!fields[docId])
  const canSubmit = !disabled && hasAcceptedAll

  return (
    <div>
      {showHeading && (
        <h4 className={cx('heading')}>
Terms of service and privacy policy
        </h4>
      )}
      {showExplanation && (
        <p className={cx('explanation')}>
          For using {applicationName}
          , you have to agree with our&nbsp;
          <>
            {documents
              .map(doc => <DocumentExplanation {...doc} />)
              .reduce((acc, elem) => [...acc, <span> and </span>, elem], [])}
          </>
          .
        </p>
      )}
      <div className={cx('checks')}>{documents.map(doc => <DocumentField {...doc} className={cx('checkBox')} />)}</div>
      <ButtonComponent
        className={cx(submitButtonClassName, { [submitButtonDisabledClassName]: !canSubmit })}
        disabled={!canSubmit}
        onClick={() => onSubmitAcceptedDocs(documentIds)}
      >
        {submitButtonLabel}
      </ButtonComponent>
    </div>
  )
}

LegalCompliance.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    }),
  ).isRequired,
  fields: PropTypes.objectOf(PropTypes.bool).isRequired,
  showHeading: PropTypes.bool,
  showExplanation: PropTypes.bool,
  applicationName: PropTypes.string,
  submitButtonLabel: PropTypes.node,
  submitButtonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  submitButtonClassName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  submitButtonDisabledClassName: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  disabled: PropTypes.bool,
  onSubmitAcceptedDocs: PropTypes.func,
}

LegalCompliance.defaultProps = {
  showHeading: false,
  showExplanation: false,
  applicationName: 'the application',
  submitButtonLabel: 'LOGIN',
  submitButtonComponent: 'button',
  submitButtonClassName: '',
  submitButtonDisabledClassName: 'disabled',
  disabled: false,
  onSubmitAcceptedDocs: () => {},
}

export default LegalCompliance
