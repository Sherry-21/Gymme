const newsPathHelper = (props:any) => {
    return `/${props.path}?newsId=${props.id}`;
}

const searchResultHelper = (props:any) => {
    return `/${props.path}?name=${props.name}`;
}

const eqDetailResultHelper = (props:any) => {
    return `/${props.path}?name=${props.name}&muscle=${props.muscle}`;
}

export {newsPathHelper, searchResultHelper, eqDetailResultHelper};