import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";
import { s3Upload } from "../libs/awsLib";

/**
 * Display a Note
 * https://serverless-stack.com/chapters/display-a-note.html
 *
 * We are doing a couple of things here.
 * 1. We are using the useEffect Hook to load the note when our component first loads. We then save it to the state.
 *    We get the id of our note from the URL using the props automatically passed to us by React-Router in props.match.params.id.
 *    The keyword id is a part of the pattern matching in our route (/notes/:id).
 * 2. If there is an attachment, we use the key to get a secure link to the file we uploaded to S3. We then store this
 *    in the new note object as note.attachmentURL.
 * 3. The reason why we have the note object in the state along with the content and the attachmentURL is because we
 *    will be using this later when the user edits the note.
 *
 * @param props
 * @returns {*}
 * @constructor
 */
export default function Notes(props) {
    const file = useRef(null);
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");

    useEffect(() => {
        function loadNote() {
            return API.get("notes", `/notes/${props.match.params.id}`);
        }

        async function onLoad() {
            try {
                const note = await loadNote();
                const { content, attachment } = note;

                if (attachment) {
                    note.attachmentURL = await Storage.vault.get(attachment);
                }

                setContent(content);
                setNote(note);
            } catch (e) {
                alert(e);
            }
        }

        onLoad();
    }, [props.match.params.id]);

/*
    return (
        <div className="Notes"></div>
    );
*/


    //---


    /**
     * Render the Note Form
     * https://serverless-stack.com/chapters/render-the-note-form.html
     *
     * We are doing a few things here:
     * 1. We render our form only when the note state variable is set.
     * 2. Inside the form we conditionally render the part where we display the attachment by using note.attachment.
     * 3. We format the attachment URL using formatFilename by stripping the timestamp we had added to the filename while uploading it.
     * 4. We also added a delete button to allow users to delete the note. And just like the submit button it too needs a flag that signals that the call is in progress. We call it isDeleting.
     * 5. We handle attachments with a file input exactly like we did in the NewNote component.
     * 6. Our delete button also confirms with the user if they want to delete the note using the browser’s confirm dialog.
     *
     */

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    /**
     * Save Changes to a Note
     * https://serverless-stack.com/chapters/save-changes-to-a-note.html
     *
     * @param note
     * @returns {Promise<any>}
     */
    function saveNote(note) {
        return API.put("notes", `/notes/${props.match.params.id}`, {
            body: note
        });
    }

    async function handleSubmit(event) {
        let attachment;

        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
                1000000} MB.`
            );
            return;
        }

        setIsLoading(true);

        /**
         * Save Changes to a Note
         * https://serverless-stack.com/chapters/save-changes-to-a-note.html
         *
         * The code below is doing a couple of things that should be very similar to what we did in the NewNote container.
         * 1. If there is a file to upload we call s3Upload to upload it and save the key we get from S3. If there isn't then we simply save the existing attachment object, note.attachment.
         * 2. We save the note by making a PUT request with the note object to /notes/:id where we get the id from props.match.params.id. We use the API.put() method from AWS Amplify.
         * 3. And on success we redirect the user to the homepage.
         */
        try {
            if (file.current) {
                attachment = await s3Upload(file.current);
            }

            await saveNote({
                content,
                attachment: attachment || note.attachment
            });
            props.history.push("/");
        } catch (e) {
            alert(e);
            setIsLoading(false);
        }
    }

    /**
     * Delete a Note
     * https://serverless-stack.com/chapters/delete-a-note.html
     *
     * @returns {Promise<any>}
     */
    function deleteNote() {
        return API.del("notes", `/notes/${props.match.params.id}`);
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteNote();
            props.history.push("/");
        } catch (e) {
            alert(e);
            setIsDeleting(false);
        }

        /**
         * Again, you might have noticed that we are not deleting the attachment when we are deleting a note.
         * We are leaving that up to you to keep things simple. Check the AWS Amplify API Docs on how to a
         * delete file from S3.
         * https://aws-amplify.github.io/amplify-js/api/classes/storageclass.html#remove
         */
    }

    return (
        <div className="Notes">
            {note && (
                <form onSubmit={handleSubmit}>
                    <FormGroup controlId="content">
                        <FormControl
                            value={content}
                            componentClass="textarea"
                            onChange={e => setContent(e.target.value)}
                        />
                    </FormGroup>
                    {note.attachment && (
                        <FormGroup>
                            <ControlLabel>Attachment</ControlLabel>
                            <FormControl.Static>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={note.attachmentURL}
                                >
                                    {formatFilename(note.attachment)}
                                </a>
                            </FormControl.Static>
                        </FormGroup>
                    )}
                    <FormGroup controlId="file">
                        {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
                        <FormControl onChange={handleFileChange} type="file" />
                    </FormGroup>
                    <LoaderButton
                        block
                        type="submit"
                        bsSize="large"
                        bsStyle="primary"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Save
                    </LoaderButton>
                    <LoaderButton
                        block
                        bsSize="large"
                        bsStyle="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </LoaderButton>
                </form>
            )}
        </div>
    );
}
