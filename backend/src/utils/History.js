module.exports = class History {
	_history = [];
	
	constructor (history) {
		if (!history || !history.length) return;
		
		if (history[0].parts) {
			this._history = [...history];
			return;
		}
		
		this._history = history.map(item => ({
			role: item.role,
			parts: [{ text: item.content }]
		}));
	}
	
	toVertexAi() {
		return this._history;
	}
	
	toOpenAi() {
		return this._history.map(item => ({
			role: item.role,
			content: item.parts[0].text
		}));
	}
	
	add(role, text) {
		this._history.push({
			role,
			parts: [{ text }]
		})
	}
	
	toJSON() {
		return this._history;
	}
	
	get length() {
		return this._history.length;
	}
	
	get last() {
		const last = this._history[this._history.length - 1];
		return { role: last.role, content: last.parts[0].text };
	}
};
