import { FormEvent, useRef, useState } from "react";
import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { NoteData, Tag } from './App';
import CreatableReactSelect from "react-select/creatable";
import { v4 as uuidv4 } from 'uuid';

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
    const tileRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        onSubmit({
            title: tileRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        })

        navigate("..")
    }

    return <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId="tilte">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={tileRef} required />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <CreatableReactSelect
                            onCreateOption={label => {
                                const newTag = { id: uuidv4(), label }
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev, newTag])
                            }}

                            options={availableTags.map(tag => {
                                return { label: tag.label, value: tag.id }
                            })}

                            value={selectedTags.map(tag => {
                                return {
                                    label: tag.label, value: tag.id
                                }
                            })}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => {
                                    return {
                                        label: tag.label, id: tag.value
                                    }
                                }))
                            }
                            }
                            isMulti />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markdown">
                <Form.Label>Body</Form.Label>
                <Form.Control required ref={markdownRef} as="textarea" rows={15} />
            </Form.Group>
            <Stack direction="horizontal" gap={2} className="justify-content-end">
                <Button type="submit" variant="primary">Save</Button>
                <Link to="..">
                    <Button type="button" variant="outline-secondary">Cancel</Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
}