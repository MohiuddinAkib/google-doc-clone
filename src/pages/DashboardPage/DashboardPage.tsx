import React from "react";
import dayjs from "dayjs";
import { IDocument } from "@src/types";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import DocumentMenu from "./DocumentMenu";
import isToday from 'dayjs/plugin/isToday'
import { Skeleton } from "@material-ui/lab";
import isBetween from 'dayjs/plugin/isBetween'
import isYesterday from 'dayjs/plugin/isYesterday'
import DocumentModal from "@components/DocumentModal";
import { Add, Description, } from "@material-ui/icons";
import { useGetDocumentsQuery } from "@data/laravel/services/api";
import { Box, Button, Container, List, ListItem, ListItemIcon, ListItemText, Typography, } from "@material-ui/core"


dayjs.extend(isToday)
dayjs.extend(isBetween)
dayjs.extend(isYesterday)

function DashboardPage() {
    const { user } = useAuth()
    const [open, setOpen] = React.useState(false);
    const { data: documents, isLoading: isDocumentsLoading } = useGetDocumentsQuery({})

    const documentList = React.useMemo(() => {
        const result: Record<"Today" | "Yesterday" | "Previous 30 days" | "Earlier", IDocument[]> = {
            Today: [],
            Yesterday: [],
            "Previous 30 days": [],
            Earlier: [],
        };

        const before2days = dayjs().subtract(2, "d");
        const before30Days = dayjs().subtract(30, "d")

        if (documents && documents.data.length) {
            documents
                .data
                .forEach((eachDocument) => {
                    if (dayjs(eachDocument.lastEditedTime).isToday()) {
                        result.Today.push(eachDocument)
                    } else if (dayjs(eachDocument.lastEditedTime).isYesterday()) {
                        result.Yesterday.push(eachDocument)
                    } else if (dayjs(eachDocument.lastEditedTime).isBetween(before2days, before30Days)) {
                        result["Previous 30 days"].push(eachDocument)
                    } else {
                        result.Earlier.push(eachDocument)
                    }
                })

        }

        return result;
    }, [documents])

    return (
        <Container maxWidth={"lg"}>
            <Box my={2} textAlign={"right"}>
                <Button onClick={() => setOpen(true)} color={"primary"} variant={"contained"} startIcon={<Add />} disableElevation>Create new</Button>

                <DocumentModal open={open} onClose={() => setOpen(false)} onSuccess={() => setOpen(false)} />
            </Box>
            <Box mt={2} display={"flex"} flexDirection={"column"} style={{ gap: 20 }}>
                {Object.entries(documentList).map(([sectionTitle, documents]) => {
                    return <Box key={sectionTitle}>
                        <Typography style={{ fontWeight: "bold" }} gutterBottom variant={"h5"}>{sectionTitle}</Typography>
                        <List dense>
                            {isDocumentsLoading ? new Array(6).fill(0).map((_, i) => (
                                <ListItem key={i} divider button>
                                    <ListItemIcon>
                                        <Description color={"primary"} />
                                    </ListItemIcon>

                                    <ListItemText disableTypography primary={<Skeleton width={100} height={30} />} secondary={<Skeleton width={70} height={25} />} />

                                    <Box flex={1}>
                                        <Skeleton width={70} height={25}>
                                            <Typography>08:30 AM</Typography>
                                        </Skeleton>
                                    </Box>
                                </ListItem>
                            )) : documents.length === 0 ?
                                <ListItem>
                                    <ListItemText primary={"No documents"} />
                                </ListItem>
                                :
                                documents.map(document => {
                                    const [userId] = Object.entries(document.users).find(([userId, meta]) => meta.owner)!;

                                    const owner = userId === user?.uid ? "me" : ""

                                    return (
                                        <ListItem key={document._id} divider button component={Link} to={`/documents/${document.documentId}/write`}>
                                            <ListItemIcon>
                                                <Description color={"primary"} />
                                            </ListItemIcon>

                                            <ListItemText primary={document.title} primaryTypographyProps={{ variant: "h6" }} secondary={`Owned by: ${owner}`} />

                                            <Box flex={1}>
                                                <Typography>{dayjs(document.lastEditedTime).format("HH:mm A")}</Typography>
                                            </Box>

                                            {document.users[user?.uid ?? ""].owner && <DocumentMenu documentId={document.documentId} />}
                                        </ListItem>
                                    )
                                })}
                        </List>
                    </Box>
                })}
            </Box>
        </Container>
    )
}

export default DashboardPage