import htmlparser2 from 'htmlparser2';

const HtmlParser = htmlparser2.Parser;

export default function getSlots(parts) {
	const output = {};
	if (parts.template && parts.template.content) {
		const template = parts.template.content;
		let lastComment = null

		const parser = new HtmlParser({
			oncomment: (data) => {
				if (data.search(/\@slot/) !== -1) {
					lastComment = data.replace('@slot', '').trim()
				}
			},
			ontext: (text) => {
				if (text.trim()) {
					lastComment = null
				}
			},
			onopentag: (name, attrs) => {
				if (name === 'slot') {
					const nameSlot = attrs.name || 'default';
					output[nameSlot] = {
						description: lastComment,
					};

					lastComment = null
				}
			},
		})

		parser.write(template)
		parser.end();
		return output;
	}
	return {};
};
