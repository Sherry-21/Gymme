const newsPathHelper = (props:any) => {
    return `/${props.path}?newsId=${props.id}`;
}

const searchResultHelper = (props:any) => {
    return `/${props.path}?name=${props.name}`;
}

const eqDetailResultHelper = (props:any) => {
    return `/equipmentDetail?muscleId=${props.muscleId}`;
}

const timerHelper = (props:any) => {
    return `/${props.path}?timerId=${props.id}`;
}

const errorHelper = (props:any) => {
    return `/errorPage?name=${props.name}`
}

const equipmentHelper = (props:any) => {
    return `/searchResult?equipmentId=${props.id}`
}

export {newsPathHelper, searchResultHelper, eqDetailResultHelper, timerHelper, errorHelper, equipmentHelper};