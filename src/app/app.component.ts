import { Component } from '@angular/core';
import { Satellite } from './satellite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'orbit-report';

  sourceList: Satellite[];
  displayList: Satellite[];
  typeList: string[];

	constructor() {
		this.sourceList = [];
		this.displayList = [];
		let satellitesUrl = 'https://handlers.education.launchcode.org/static/satellites.json';

		window.fetch(satellitesUrl).then(function (response) {
			response.json().then(function (data) {

				let fetchedSatellites = data.satellites;
				// loop over satellites
				for(let i=0; i < fetchedSatellites.length; i++) {
					// create a Satellite object 
					let satellite = new Satellite(fetchedSatellites[i].name, fetchedSatellites[i].type, fetchedSatellites[i].launchDate, fetchedSatellites[i].orbitType, fetchedSatellites[i].operational);
					// add the new Satellite object to sourceList 
					this.sourceList.push(satellite);
				 }

				// make a copy of the sourceList to be shown to the user
				this.displayList = this.sourceList.slice(0);
				this.typeList = this.satelliteTypeList(this.sourceList);
			}.bind(this));
		}.bind(this));

	}

	search(searchTerm: string): void {
		let matchingSatellites: Satellite[] = [];
		searchTerm = searchTerm.toLowerCase();
		for(let i=0; i < this.sourceList.length; i++) {
			let name = this.sourceList[i].name.toLowerCase();
			let type = this.sourceList[i].type.toLowerCase();
			let orbitType = this.sourceList[i].orbitType.toLowerCase();
			if (name.indexOf(searchTerm) >= 0 || type === searchTerm || orbitType === searchTerm) {
				matchingSatellites.push(this.sourceList[i]);
			}
		}
		// assign this.displayList to be the array of matching satellites
		// this will cause Angular to re-make the table, but now only containing matches
		this.displayList = matchingSatellites;
	}

	satelliteTypeList(satellites: Satellite[]): string[] {
		let differntTypes = [];
		for(let i = 0; i < satellites.length; i++) {
			if(differntTypes.indexOf(satellites[i].type) === -1)
			differntTypes.push(satellites[i].type);
		}
		return differntTypes;
	}

}
