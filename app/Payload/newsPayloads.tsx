import {ensureManifestHasValidIntentFilter} from "@expo/config-plugins/build/android/Scheme";


const informationPayload = () =>{
    
}

interface EquipmentDetailPayload{
    "article_body_paragraph":string;
    "article_image_content_path": string;
}
interface EquipmentPayload {
    article_id: number;
    article_header: string;
    article_date_created: string;
    article_header_image_path: string;
    article_body_content: EquipmentDetailPayload[] | null;
    article_type_id: number;
}

export {EquipmentPayload,informationPayload};