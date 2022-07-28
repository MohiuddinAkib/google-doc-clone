import React from 'react';
import { Omit } from '@material-ui/types';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { Link as RouterLink, LinkProps as RouterLinkProps, useRouteMatch } from 'react-router-dom';

interface ListItemLinkProps extends Omit<ListItemProps, "button" | "component"> {
    to: string;
    path: string;
    exact?: boolean
}

export default function ListItemLink(props: React.PropsWithChildren<ListItemLinkProps>) {
    const match = useRouteMatch({
        path: props.path,
        exact: props.exact ?? false
    })


    const { children, to } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
                <RouterLink to={to} ref={ref} {...itemProps} />
            )),
        [to],
    );

    return (
        <li>
            <ListItem button selected={!!match} component={renderLink}>
                {children}
            </ListItem>
        </li>
    );
}
