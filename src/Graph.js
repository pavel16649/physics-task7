import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './main.css'

const Graph = () => {
    const [layout] = useState({
        width: 1100,
        height: 700,
        xaxis: { title: 'Время t (c)' },
        yaxis: { title: 'Напряжение U (В)' },
        title: "Биения",
    });

    const [v1 , setv1] = useState(20);
    const [v2 , setv2] = useState(22);
    const [A , setA] = useState(1);

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    function min(left, right) {
        return left < right ? left : right;
    }

    function abs(left) {
        return left >= 0 ? left : -left;
    }

    const Update_v1 = (new_v1) => {
        if (abs(new_v1 - v2) / min(new_v1, v2) > 0.1) {
            setShowModal(true);
        }
        setv1(new_v1);
    }

    const Update_v2 = (new_v2) => {
        if (abs(v1 - new_v2) / min(v1, new_v2) > 0.1) {
            setShowModal(true);
        }

        setv2(new_v2);
    }

    const xValues = Array.from({ length: 100000 }, (_, i) => i / 100000);
    const yValuesSum = xValues.map((x) => 2 * A * Math.cos(2 * Math.PI * min(v1, v2) * x) * Math.cos(Math.PI * abs(v2-v1) * x));
    const yValues1 = xValues.map((x) => A * Math.cos(2 * Math.PI * v1 * x));
    const yValues2 = xValues.map((x) => A * Math.cos(2 * Math.PI * v2 * x));


    return (
        <div className='body' style={{ position: 'relative' }}>
            <div>
                <h1>Сложение колебаний с одинаковой амплитудой и незначительно отличающейся частотой</h1>
                <div className='inputs'>
                    <div className='input'>
                        Введите частоту первого колебания (Гц): <input type="number" value={v1} step='any' min='0'
                                                              onChange={(e) => Update_v1(parseFloat(e.target.value))}/>
                    </div>
                    <div className='input'>
                        Введите частоту второго колебания (Гц): <input type="number" value={v2} step='any' min='0'
                                                            onChange={(e) => Update_v2(parseFloat(e.target.value))}/>
                    </div>
                    <div className='input'>
                        Введите амплитуду A (В): <input type="number" value={A} step='any' min='0'
                                                            onChange={(e) => setA(parseFloat(e.target.value))}/>
                    </div>
                </div>
            </div>
            <Plot
                data={[
                    {
                        x: xValues,
                        y: yValuesSum,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'blue'},
                        name: 'Биение'
                    },
                    {
                        x: xValues,
                        y: yValues1,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'red'},
                        name: 'Первое колебание'
                    },
                    {
                        x: xValues,
                        y: yValues2,
                        type: 'scatter',
                        mode: 'lines',
                        marker: {color: 'green'},
                        name: 'Второе колебание'
                    },
                ]}
                layout={layout}
            />
            {showModal && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Предупреждение</h2>
                        <p>Разница выбранных частот слишком большая, формула для биений может быть неверна.</p>
                        <button onClick={handleCloseModal}>Попробую другие</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Graph;
