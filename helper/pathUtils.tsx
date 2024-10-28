const newsPathHelper = (props:any) => {
    return `/${props.path}?newsId=${props.id}`;
}

export default newsPathHelper;