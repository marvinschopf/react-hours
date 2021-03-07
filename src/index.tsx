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
	EventClickArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function mapDateDayToRealDay(num: number): number {
	return [6, 1, 2, 3, 4, 5][num] + 1;
}

function mapDayToName(num: number): string {
	return [
		"",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	][num];
}

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
