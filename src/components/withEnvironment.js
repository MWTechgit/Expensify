import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as Environment from '../libs/Environment/Environment';
import CONST from '../CONST';
import getComponentDisplayName from '../libs/getComponentDisplayName';

const environmentPropTypes = {
    /** The string value representing the current environment */
    environment: PropTypes.string.isRequired,

    /** The string value representing the URL of the current environment */
    environmentURL: PropTypes.string.isRequired,
};

export default function (WrappedComponent) {
    class WithEnvironment extends Component {
        constructor(props) {
            super(props);

            this.state = {
                environment: CONST.ENVIRONMENT.PRODUCTION,
                environmentURL: CONST.NEW_EXPENSIFY_URL,
            };
        }

        componentDidMount() {
            Environment.getEnvironment().then((environment) => {
                this.setState({environment});
            });
            Environment.getEnvironmentURL().then((environmentURL) => {
                this.setState({environmentURL});
            });
        }

        render() {
            return (
                <WrappedComponent
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...this.props}
                    ref={this.props.forwardedRef}
                    environment={this.state.environment}
                    environmentURL={this.state.environmentURL}
                />
            );
        }
    }

    WithEnvironment.displayName = `withEnvironment(${getComponentDisplayName(WrappedComponent)})`;
    WithEnvironment.propTypes = {
        forwardedRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({current: PropTypes.instanceOf(React.Component)})]),
    };
    WithEnvironment.defaultProps = {
        forwardedRef: undefined,
    };
    return React.forwardRef((props, ref) => (
        <WithEnvironment
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            forwardedRef={ref}
        />
    ));
}

export {environmentPropTypes};
