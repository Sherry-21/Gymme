import {ensureManifestHasValidIntentFilter} from "@expo/config-plugins/build/android/Scheme";


const informationPayload = () =>{
    
}

interface EquipmentDetailPayload{
    "information_body_paragraph":string;
    "information_image_content_path": string;
}
interface EquipmentPayload {
    information_id: number;
    information_header: string;
    information_date_created: string;
    information_body_content: EquipmentDetailPayload[] | null;
    information_type_id: number;
}

export {EquipmentPayload,informationPayload};