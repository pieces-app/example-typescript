import * as React from 'react';
import * as Pieces from "@pieces.app/pieces-os-client";
import ActivityCard from './ActivityCard';

interface WorkflowActivity {
    id: string;
    name: string;
    description: Pieces.TrackedAssetEventIdentifierDescriptionPairs;
}

const WorkflowActivityList: React.FC = () => {
    const [activities, setActivities] = React.useState<WorkflowActivity[]>([]);

    const clearActivities = () => {
        setActivities([]);
    }

    const refreshActivities = (activity: WorkflowActivity) => {
        setActivities(prevActivities => [...prevActivities, activity]);
    }

    React.useEffect(() => {
        new Pieces.ActivitiesApi().activitiesSnapshot({}).then((activities) => {
            // console.log(activities);
            clearActivities();
            for(let i = 0; i < activities.iterable.length; i++){
                if(activities.iterable[i].asset == null){
                    continue;
                }
                let _activity : WorkflowActivity ={
                    id : i.toString(),
                    name : activities.iterable[i].asset.name,
                    description : activities.iterable[i].event.asset.identifierDescriptionPair
                }
                // console.log(_activity);
                refreshActivities(_activity);
            }
        })
    }, []);

    return (
        <div style={{overflowY: 'scroll',overflowX:'hidden',msOverflowY:'hidden'}}>
            <ul style={{padding:0}}>
                {activities.map(activity => (
                    <ActivityCard key={activity.id} name={activity.name} description={activity.description} />
                )).reverse()}
            </ul>
        </div>
    );
};

export default WorkflowActivityList;
