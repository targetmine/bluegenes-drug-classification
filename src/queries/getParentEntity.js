const queryParent = (entityId, className, code) => ({
	from: className,
	select: [code, 'name', 'parent.' + code, 'parent.name'],
	orderBy: [
		{
			path: code,
			direction: 'ASC'
		}
	],
	joins: ['parent'],
	where: [
		{
			path: 'id',
			op: '=',
			value: entityId
		}
	]
});

// eslint-disable-next-line
function queryData(entityId, className, code, serviceUrl, imjsClient = imjs) {
	return new Promise((resolve, reject) => {
		const service = new imjsClient.Service({ root: serviceUrl });
		service
			.records(queryParent(entityId, className, code))
			.then(data => {
				if (data.length) resolve(data[0]);
				else reject('Failed to retrieve the data for ' + className + ' class.');
			})
			.catch(reject);
	});
}

module.exports = queryData;
