import { TrackedAssetEventIdentifierDescriptionPairs } from '@pieces.app/pieces-os-client';
import * as React from 'react';

interface WorkflowActivity {
    name: string;
    description: TrackedAssetEventIdentifierDescriptionPairs;
}


const ActivityCard: React.FC<WorkflowActivity> = ({name,description}) => {

    function reformatActvityText(text: string){
        let _text = "";
        for(let i = 0; i < text.length; i++){
            if(text[i] == '_'){
                _text += " ";
            }
            else{
                _text += text[i];
            }
        }
        return _text+" : ";
    }

    return (
        <div style={{backgroundColor:'#28272C',padding:5,margin:10,borderRadius:10,borderColor:'gray',borderWidth:10}}>
            <text style={{color:'white',fontSize:18}}>{reformatActvityText(description.activityAssetReferenced || description.assetAnchorAdded || description.assetAnchorDeleted || description.assetAnchorUpdated || description.assetAnnotationAdded || description.assetAnnotationDeleted || description.assetAnnotationUpdated || description.assetCreated || description.assetCreationFailed || description.assetDeleted || description.assetDescriptionUpdated || description.assetFormatCopied || description.assetFormatDownloaded || description.assetFormatGenericClassificationUpdated || description.assetFormatSpecificClassificationUpdated || description.assetFormatUpdated || description.assetFormatValueEdited || description.assetFormatValueEdited || description.assetHintAdded || description.assetHintDeleted || description.assetHintUpdated || description.assetLinkAdded || description.assetLinkDeleted || description.assetLinkGenerated || description.assetLinkRevoked || description.assetNameUpdated || description.assetPersonAdded || description.assetPersonDeleted || description.assetReferenced || description.assetSensitiveAdded || description.assetSensitiveDeleted || description.assetTagAdded || description.assetTagDeleted || description.assetUpdated || description.assetViewed || description.searchedAssetReferenced || description.suggestedAssetReferenced)} </text>
            <text style={{color:'white',fontSize:14}}>{name}</text>
        </div>
    );
}

export default ActivityCard;
