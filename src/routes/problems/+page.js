// @ts-nocheck
export const prerender = true;
export const ssr = false;
import { url } from "$lib/submissions";

let problemPreview = {
    dynamicArray: {
        "id": "dynamicArray",
        "name": "Design Dynamic Array (Resizable Array)",
        "difficulty": "Easy",
        "free": true,
        "tag": "Implement Data Structures",
        "unreleased": null
    },
    singlyLinkedList: {
        "id": "singlyLinkedList",
        "name": "Design Singly Linked List",
        "difficulty": "Easy",
        "free": true,
        "tag": "Implement Data Structures",
        "unreleased": null
    },
};


export const load = async ({ fetch }) => {
    const url_problem = `${url}/problems/`;
    const response = await fetch(url_problem)
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const problems = await response.json()

    return problems;
}

