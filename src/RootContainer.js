import React from 'react';
import getParentEntity from './queries/getParentEntity';

var classInfo = {
	AtcClassification: { name: 'ATC Classification', code: 'atcCode' },
	JscClassification: {
		name: 'Japan Standard Commodity Classification(JSCC)',
		code: 'jsccCode'
	}
};

class ClassificationInfo extends React.Component {
	render() {
		let data = this.props.data;
		data.sort(sortByHierarchy);
		return (
			<tbody>
				{data.map((row, index) => (
					<tr key={index} className={index % 2 ? 'odd' : 'even'}>
						<td>
							<span
								className="naviLink"
								onClick={() => {
									this.props.navigate('report', {
										type: row.class,
										id: row.objectId
									});
								}}
							>
								{row[classInfo[row.class].code]}
							</span>
						</td>
						<td>
							<span
								className="naviLink"
								onClick={() => {
									this.props.navigate('report', {
										type: row.class,
										id: row.objectId
									});
								}}
							>
								{row.name}
							</span>
						</td>
					</tr>
				))}
			</tbody>
		);
	}
}

function sortByHierarchy(a, b) {
	return a[classInfo[a.class].code].length - b[classInfo[b.class].code].length;
}

class RootContainer extends React.Component {
	constructor(props) {
		super(props);
		// console.log(props);
		this.state = {
			hierarchy: [],
			message: ''
		};
	}

	allHierarchy = [];

	componentDidMount() {
		let entity = Object.values(this.props.entity)[0];
		this.getAllHierarchy(entity.value, entity.class, this.props.serviceUrl);
	}

	getAllHierarchy(entityId, className, serviceUrl) {
		let code = classInfo[className].code;
		getParentEntity(entityId, className, code, serviceUrl)
			.then(res => {
				this.allHierarchy.push(res);
				if (res.parent) {
					this.getAllHierarchy(res.parent.objectId, className, serviceUrl);
				}
				this.setState({ hierarchy: this.allHierarchy });
			})
			.catch(error => {
				this.setState({ message: error });
			});
	}

	render() {
		let entity = Object.values(this.props.entity)[0];
		return (
			<div className="rootContainer">
				<h1>{classInfo[entity.class].name}</h1>
				<table className="hierarchyTable">
					<thead>
						<tr>
							<th>Code</th>
							<th>Name</th>
						</tr>
					</thead>
					<ClassificationInfo
						data={this.state.hierarchy}
						navigate={this.props.navigate}
					/>
				</table>
			</div>
		);
	}
}

export default RootContainer;
