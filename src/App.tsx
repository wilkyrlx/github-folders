import React from 'react';

import './App.css'

import { listData } from './assets/listData'
import DraggableList from './components/list/DraggableList';
import Card from './components/card/Card';

export default function App() {
    return (
        <>
            <h1 className="header">
                React drag and drop list
            </h1>
            <DraggableList
                data={listData}
                renderItemContent={(item) => LessonCard(item)}
            />
        </>
    );
}

const LessonCard = (item: object | null | undefined) => <Card item={item}/>

