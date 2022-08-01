import React from 'react'
import sharedb from 'sharedb/lib/client'
import { useAuth } from '@hooks/useAuth'
import { container } from '@src/appEngine'
import { nanoid } from '@reduxjs/toolkit'
import { DevTool } from '@hookform/devtools'
import { Autocomplete } from '@material-ui/lab'
import { ConfigService } from "@config/ConfigService";
import ReconnectingWebSocket from 'reconnecting-websocket'
import { AccountCircle, Delete, } from '@material-ui/icons'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useCreateDocumentMutation, useGetDocumentDetailsQuery, useGetPeopleQuery, useUpdateDocumentMutation } from '@data/laravel/services/api'
import { Avatar, Box, Button, Dialog, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, ListItem, ListItemAvatar, ListItemText, TextField, IconButton, CircularProgress } from '@material-ui/core'

const configService = container.get<ConfigService>(ConfigService);

function DocumentModal({ onSuccess, documentId, open, onClose }: { onSuccess?: () => void, documentId?: string, open: boolean, onClose?: () => any }) {
    const { user } = useAuth();

    const { register, control, handleSubmit, setValue } = useForm({
        defaultValues: {
            title: "Untitled document",
            users: [] as { id: string; read: boolean; write: boolean }[],
        }
    });

    const { fields, append, remove, } = useFieldArray({
        control,
        name: "users",
        keyName: "listId"
    })

    const { data: documentDetails, isLoading: isLoadingDocumentDetails } = useGetDocumentDetailsQuery({
        documentId: documentId!
    },
        {
            skip: !documentId
        })


    React.useEffect(() => {
        if (documentDetails) {
            setValue("title", documentDetails.title)
            setValue("users", Object.entries(documentDetails.users).map(([userId, userData]) => ({
                id: userId,
                read: userData.read,
                write: userData.write
            })))
        }

    }, [documentDetails, setValue])

    const [createDocument, { isLoading: isCreating }] = useCreateDocumentMutation()
    const [updateDocument, { isLoading: isUpdating }] = useUpdateDocumentMutation()

    const handleDocumentCreate = (values: {
        title: string;
        users: {
            id: string;
            read: boolean;
            write: boolean;
        }[];
    }) => {
        const socket = new ReconnectingWebSocket(`${configService.wsBaseURL}?userId=${user?.uid}`);
        const connection = new sharedb.Connection(socket as any);

        const documentId = nanoid();
        const collection = "collaborative_community", id = documentId
        const doc = connection.get(collection, id);

        doc.create([{ insert: "" }], "http://sharejs.org/types/rich-text/v1", (error) => {
            createDocument({
                documentId,
                title: values.title,
                users: values.users
            })
                .unwrap()
                .then(() => {
                    onSuccess?.()
                })
        })
    };

    const handleDocumentUpdate = (values: {
        title: string;
        users: {
            id: string;
            read: boolean;
            write: boolean;
        }[];
    }) => {
        updateDocument({
            documentId: documentId!,
            title: values.title,
            users: values.users
        })
            .unwrap()
            .then(() => {
                onSuccess?.()
            })
    }

    const handleDocumentAction = handleSubmit((values) => {
        if (documentId) {
            handleDocumentUpdate(values)
        } else {
            handleDocumentCreate(values)
        }
    })

    const { data: peopleData, isLoading: isLoadingPeopleData } = useGetPeopleQuery()

    const peopleOptions = React.useMemo(() => {
        if (!peopleData?.data) {
            return []
        }

        return peopleData.data;
    }, [peopleData])

    return (
        <Box>

            <Dialog onClick={e => {
                e.preventDefault();
                e.stopPropagation()
            }} maxWidth={"lg"} open={open} onClose={onClose}>
                <DialogTitle style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                    {!documentId ? "Add" : "Update"} document
                </DialogTitle>
                <DialogContent>
                    {isLoadingDocumentDetails ? <Box width={600} height={400} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                        <CircularProgress />
                    </Box> : <Box width={600}>
                        <Box mb={3}>
                            <TextField label={"Title"} margin={"dense"} {...register("title")} variant={"outlined"} fullWidth />
                        </Box>
                        {fields.map((field, i) => field.id !== user?.uid && (
                            <Box key={field.listId} mb={3}>
                                <Box display={"flex"} style={{ gap: 10 }}>
                                    <Box flex={1}>
                                        <Controller
                                            control={control}
                                            name={`users.${i}.id`}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    fullWidth
                                                    options={peopleOptions}
                                                    loading={isLoadingPeopleData}
                                                    defaultValue={peopleOptions.find(people => people.uid === field.value)}
                                                    getOptionLabel={(option) => option?.displayName ?? option.email}
                                                    onChange={(_, value, reason) => {
                                                        if (value && reason === "select-option") {
                                                            field.onChange(value.uid)
                                                        }
                                                    }}
                                                    renderOption={(option) =>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <Avatar src={option.photoURL} />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={option.displayName} secondary={option.email} />
                                                        </ListItem>}
                                                    renderInput={(params) => <TextField  {...params} margin={"dense"} label={"Add people"} variant={"outlined"} />}
                                                />
                                            )}
                                        />

                                    </Box>

                                    <IconButton onClick={() => remove(i)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                                {/* <Controller
                                    control={control}
                                    name={`users.${i}.read` as 'users.0.read'}
                                    render={({ field }) => <FormControlLabel label={"Read"} control={<Checkbox />} {...field} checked={field.value} color={"primary"} />}
                                /> */}

                                <Controller
                                    control={control}
                                    name={`users.${i}.write` as 'users.0.write'}
                                    render={({ field }) => <FormControlLabel label={"Write"} control={<Checkbox />} {...field} checked={field.value} color={"primary"} />}
                                />


                            </Box>
                        ))}
                        <Button onClick={() => {
                            append({
                                read: true,
                                write: true
                            })
                        }} color={"primary"} startIcon={<AccountCircle />}>Add people</Button>
                    </Box>}
                    <DevTool control={control} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDocumentAction} disabled={isCreating || isUpdating || isLoadingDocumentDetails} variant={"contained"} color={"primary"} disableElevation>Done</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DocumentModal