
import "quill/dist/quill.snow.css";
import "./document-write-page.css"

import Quill from "quill";
import React from 'react'
// @ts-ignore
import richText from 'rich-text';
import tinycolor from "tinycolor2"
import { User } from 'firebase/auth';
import { makePdf } from '@utils/quill'
import { Box, } from '@material-ui/core';
import QuillCursors from "quill-cursors";
import { useAuth } from '@hooks/useAuth';
import * as sharedb from 'sharedb/lib/client';
import { useHistory, useParams } from 'react-router';
import DocumentWriteLayout from './DocumentWriteLayout';
import ReconnectingWebSocket from 'reconnecting-websocket';
// @ts-ignore
import ImageUploader from "quill-image-uploader";
import { isJoteyQueryError } from "@utils/error-handling";
import { useGetDocumentDetailsQuery, useUploadFileMutation } from '@data/laravel/services/api';

Quill.register("modules/cursors", QuillCursors);
Quill.register("modules/imageUploader", ImageUploader);


sharedb.types.register(richText.type)

const colors: Record<string, string> = {}

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

function DocumentWritePage() {
    const { user } = useAuth();
    const history = useHistory();
    const userRef = React.useRef(user)
    const quillRef = React.useRef<Quill>(null!)
    const [uploadFile] = useUploadFileMutation()
    const docRef = React.useRef<sharedb.Doc>(null!)
    const wrapperRef = React.useRef<HTMLDivElement>(null!);
    const { documentId } = useParams<{ documentId: string }>()
    const documentIdRef = React.useRef(documentId)

    const [userColor] = React.useState(() => tinycolor.random().toHexString())
    const [usersRecord, setUsersRecord] = React.useState<Record<string, User>>({})
    const [userIdPresenceIdMap, setUserIdPresenceIdMap] = React.useState<Record<string, string>>({})
    const userIdPresenceIdMapRef = React.useRef(userIdPresenceIdMap)

    const users = React.useMemo(() => {
        return Object.values(usersRecord)
    }, [usersRecord])

    React.useEffect(() => {
        userIdPresenceIdMapRef.current = userIdPresenceIdMap
    }, [userIdPresenceIdMap])

    const { data: documentData, isError: isDocumentDataError, error: documentDataError } = useGetDocumentDetailsQuery({
        documentId
    }, {
        skip: !documentId
    })

    const documentDataRef = React.useRef(documentData);

    React.useEffect(() => {
        documentDataRef.current = documentData
    }, [documentData]);

    React.useEffect(() => {
        if (isDocumentDataError && isJoteyQueryError(documentDataError) && documentDataError.status === 403) {
            history.replace("/")
        }
    }, [isDocumentDataError, documentDataError, history])

    React.useEffect(() => {
        // Open WebSocket connection to ShareDB server
        const socket = new ReconnectingWebSocket(`ws://localhost:8000?userId=${userRef.current?.uid}`);
        const connection = new sharedb.Connection(socket as any);

        const collection = "collaborative_community", id = documentIdRef.current
        const doc = connection.get(collection, id);

        docRef.current = doc;

        const cursorPresence = connection.getDocPresence(collection, id);
        cursorPresence.subscribe(function (error) {
            if (error) throw error;
        });

        const usersPresence = connection.getPresence(id)
        usersPresence.subscribe()

        usersPresence.on("receive", (presenceId, user) => {
            if (user === null) {

                // The remote client is no longer present in the document
                const userUid = userIdPresenceIdMapRef.current[presenceId];
                setUsersRecord(prevUsers => {
                    const copied = {
                        ...prevUsers
                    }

                    delete copied[userUid];
                    return copied
                })

                setUserIdPresenceIdMap(prevData => {
                    const copied = {
                        ...prevData
                    }

                    delete copied[presenceId];
                    return copied
                })
            } else {
                setUserIdPresenceIdMap(prevData => ({
                    ...prevData,
                    [presenceId]: user.uid
                }))
                setUsersRecord(prevUsers => ({
                    ...prevUsers,
                    [user.uid]: user
                }))
                // Handle the new value by updating UI, etc.
            }
        })

        usersPresence.create().submit(userRef.current)

        doc.subscribe(function (err) {
            if (err) throw err;

            wrapperRef.current.innerHTML = ""
            const editor = document.createElement("div")
            wrapperRef.current.appendChild(editor)

            const quill = new Quill(editor, {
                theme: "snow",
                modules: {
                    cursors: true,
                    toolbar: TOOLBAR_OPTIONS,
                    imageUploader: {
                        upload: (file: File) => {
                            return new Promise((resolve, reject) => {
                                uploadFile({
                                    file
                                })
                                    .unwrap()
                                    .then(data =>
                                        resolve(data.downloadUrl)
                                    )
                                    .catch(reject)
                            });
                        },
                    },
                }
            });
            quillRef.current = quill
            const cursors = quill.getModule("cursors");


            quill.on("text-change", function (delta, oldDelta, source) {
                if (source !== "user") return;
                doc.submitOp(delta, { source: quill });
            });

            quill.setContents(doc.data);

            if (!documentDataRef.current?.users[userRef.current?.uid ?? ""].write) {
                quill.disable()
            }

            // Change view of article if it gets edited in realtime
            doc.on("op", function (op: any, source: Quill, clientId) {
                if (source === quill) return;
                quill.updateContents(op);
            });


            const localPresence = cursorPresence.create();

            quill.on("selection-change", function (range, oldRange, source) {
                // We only need to send updates if the user moves the cursor
                // themselves. Cursor updates as a result of text changes will
                // automatically be handled by the remote client.
                if (source !== 'user') return;
                // Ignore blurring, so that we can see lots of users in the
                // same window. In real use, you may want to clear the cursor.
                if (!range) return;
                // In this particular instance, we can send extra information
                // on the presence object. This ability will vary depending on
                // type.
                localPresence.submit({
                    ...range,
                    color: userColor,
                    name: userRef.current?.displayName,
                }, function (error) {
                    if (error) throw error;
                });
            });

            cursorPresence.on('receive', function (id, range) {
                colors[id] = colors[id] || tinycolor.random().toHexString();
                const name = (range && range.name) || "Anonymous";
                cursors.createCursor(id, name, colors[id]);
                cursors.moveCursor(id, range);
            });
        });

        return () => {
            doc.destroy();
            usersPresence.destroy();
            cursorPresence.destroy();
        }
        // eslint-disable-next-line
    }, []);

    const handleDownloadWord = async () => {
        if (quillRef.current) {
            await makePdf(quillRef.current, {
                name: documentData?.title ?? ""
            })
        }
    }

    return (
        <DocumentWriteLayout activeUsers={users} documentTitle={documentData?.title} onDownLoad={handleDownloadWord}>
            <Box width={"100%"}>

                <div className={"container"} ref={wrapperRef}></div>
            </Box>
        </DocumentWriteLayout>
    )
}

export default DocumentWritePage