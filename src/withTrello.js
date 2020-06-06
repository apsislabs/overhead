export const withTrello = (Component) => ({ trello, ...rest }) => {
    if ( !trello ) {
        return "Waiting for Trello..."
    }

    const t = trello.iframe();

    return <Component trello={trello} t={t} {...rest} />
}
