import React from 'react'
import { MoreVert } from '@material-ui/icons'
import { useConfirm } from 'material-ui-confirm';
import DocumentModal from '@components/DocumentModal';
import { useDeleteDocumentMutation } from '@data/laravel/services/api';
import { ClickAwayListener, IconButton, ListItemSecondaryAction, Menu, MenuItem } from '@material-ui/core'
import {
    bindMenu,
    bindTrigger,
    usePopupState,
} from 'material-ui-popup-state/hooks'

function DocumentMenu({ documentId }: { documentId: string }) {
    const confirm = useConfirm();
    const [open, setOpen] = React.useState(false)
    const popupState = usePopupState({ variant: "popover", popupId: documentId });
    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation()

    const handleDelete = () => {
        confirm({ description: 'Are your sure?' })
            .then(() => {
                deleteDocument({
                    documentId,
                })

            })
    }

    const handleOpenEditModal = () => setOpen(true)

    return (
        <>
            <ListItemSecondaryAction>
                <IconButton {...bindTrigger(popupState)} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation()

                    popupState.open()
                    popupState.setAnchorEl(e.currentTarget)
                }}>
                    <MoreVert />
                </IconButton>

                <ClickAwayListener onClickAway={popupState.close}>
                    <Menu
                        {...bindMenu(popupState)}
                        onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}>
                        <MenuItem onClick={handleOpenEditModal}>
                            Update
                        </MenuItem>
                        <MenuItem disabled={isDeleting} onClick={handleDelete}>
                            Remove
                        </MenuItem>
                    </Menu>
                </ClickAwayListener>
            </ListItemSecondaryAction>
            <DocumentModal open={open} onClose={() => setOpen(false)} documentId={documentId} onSuccess={() => setOpen(false)} />
        </>
    )
}

export default DocumentMenu