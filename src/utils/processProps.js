import getProp from './getProp';

export default function processProps(docFile, component) {
	let props = component.props;
	let mixins = component.mixins;
	if ( mixins ) {
		mixins.forEach(mixin => {
			const pMixin = mixin.props;
			if (pMixin) {
				props = Object.assign({}, pMixin, props);
			}
		});
	}
	if ( props ) {
		const listDocProps = {};
		if ( Array.isArray(props) ) {
			props.forEach( propName => {
				listDocProps[propName] = getProp();
			});
		} else {
			docFile.reverse()
			Object.keys(props).forEach( key => {
				const propName = key;
				const docPart = docFile.reverse().filter( comment => {
					return comment.longname.indexOf('props.' + propName) > -1
				})[0];
				const prop = props[propName];
				const docProp = getProp(prop, docPart);
				listDocProps[propName] = docProp;
			})
		}
		return listDocProps;
	}
	return;
}
