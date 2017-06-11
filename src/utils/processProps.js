import getProp from './getProp';

export default function processProps(docFile, component) {
	if ( component.props ) {
		const listProps = {};
		if ( Array.isArray(component.props) ) {
			component.props.forEach( propName => {
				listProps[propName] = getProp();
			});
		} else {
			Object.keys(component.props).forEach( key => {
				const propName = key;
				const docPart = docFile.filter( comment => {
					return comment.longname.indexOf('props.' + propName) > -1
				})[0];
				const prop = component.props[propName];
				const docProp = getProp(prop, docPart);
				const listTags = docProp['tags']
				if ( listTags ) {
					if ( !listTags['ignore'] ) {
						listProps[propName] = docProp;
					}
				} else {
					listProps[propName] = docProp;
				}
			})
		}
		return listProps;
	}
	return;
}
