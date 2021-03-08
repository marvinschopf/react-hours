/**
 * react-hours
 * Copyright 2021 Marvin Schopf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @license Apache-2.0
 * @copyright 2021 Marvin Schopf
 *
 */

import React from "react";
import FullCalendar, {
	DateSelectArg,
	EventApi,
	EventClickArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import openingHours from "opening_hours";

type Props = {
	value?: string;
	locale?: string;
	theme?: "standard" | "bootstrap";
};

class Hours extends React.Component<Props> {
	calendarRef: React.RefObject<FullCalendar> = React.createRef();

	constructor(props: Props) {
		super(props);
	}

	importOSM(oh: string) {
		if (oh != "24/7") {
			const ohObject = new openingHours(oh);
			const ohIterator = ohObject.getIterator(
				moment()
					.day("Monday")
					.set("hours", 0)
					.set("minutes", 0)
					.toDate()
			);
			let iteratorChanges = [];
			let latestChange;
			while (
				ohIterator.advance(
					moment()
						.day("Monday")
						.add(1, "week")
						.set("hours", 23)
						.set("minutes", 59)
						.toDate()
				)
			) {
				console.debug(
					`${ohIterator.getDate()}: ${ohIterator.getState()}`
				);
				if (latestChange) {
					if (
						ohIterator.getState() === false &&
						latestChange.state === true
					) {
						latestChange.to = ohIterator.getDate();
						iteratorChanges.push(latestChange);
						this.calendarRef.current.getApi().addEvent({
							start: latestChange.from,
							end: latestChange.to,
						});
						latestChange = null;
					}
				} else {
					latestChange = {
						state: ohIterator.getState(),
						from: ohIterator.getDate(),
					};
				}
			}
			console.debug(iteratorChanges);
		} else {
			this.calendarRef.current.getApi().addEvent({
				start: moment()
					.day("Monday")
					.set("hours", 0)
					.set("minutes", 0)
					.toDate(),
				end: moment()
					.day("Monday")
					.add(1, "week")
					.set("hours", 23)
					.set("minutes", 59)
					.toDate(),
			});
			console.debug([
				{
					from: moment()
						.day("Monday")
						.set("hours", 0)
						.set("minutes", 0)
						.toDate(),
					to: moment()
						.day("Monday")
						.add(8, "days")
						.set("hours", 23)
						.set("minutes", 59)
						.toDate(),
					state: true,
				},
			]);
		}
	}

	componentDidMount() {
		if (this.props.value) {
			this.importOSM(this.props.value);
		}
	}

	render() {
		return (
			<React.Fragment>
				<FullCalendar
					ref={this.calendarRef}
					plugins={[interactionPlugin, dayGridPlugin]}
					selectable={true}
					selectOverlap={true}
					select={(selectionInfo: DateSelectArg) => {
						console.debug(selectionInfo);
						const existingEvents: EventApi[] = this.calendarRef.current
							.getApi()
							.getEvents();
						let conflict: boolean = false;
						existingEvents.forEach((existingEvent: EventApi) => {
							if (
								moment(selectionInfo.start).isBetween(
									existingEvent.start,
									existingEvent.end
								) ||
								moment(selectionInfo.end).isBetween(
									existingEvent.start,
									existingEvent.end
								) ||
								moment(existingEvent.start).isBetween(
									selectionInfo.start,
									selectionInfo.end
								) ||
								moment(existingEvent.end).isBetween(
									selectionInfo.start,
									selectionInfo.end
								)
							) {
								conflict = true;
							}
						});
						if (!conflict)
							this.calendarRef.current.getApi().addEvent({
								start: selectionInfo.start,
								end: selectionInfo.end,
							});
					}}
					locale={this.props.locale ? this.props.locale : "en"}
					headerToolbar={false}
					dayHeaderFormat={{
						weekday: "long",
					}}
					themeSystem={
						this.props.theme ? this.props.theme : "standard"
					}
					eventClick={(eventInfo: EventClickArg) => {
						eventInfo.event.remove();
					}}
					eventOverlap={false}
					editable={true}
					droppable={false}
				/>
			</React.Fragment>
		);
	}
}

export default Hours;
