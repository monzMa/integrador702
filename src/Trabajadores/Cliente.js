import React, { useEffect, useState } from 'react'; 
import '../App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Cliente = () => {
    const [cliente, setCliente] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCliente(data);
            } catch (error) {
                setError(error);
                console.error('Fetch error:', error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 5000);  // Actualiza cada 5 segundos
        return () => clearInterval(interval);
    }, []);

    // Filtra y cuenta los clientes por sexo
    const sexCount = cliente.reduce((acc, curr) => {
        if (curr.sexo === 'M') {
            acc.male += 1;
        } else if (curr.sexo === 'F') {
            acc.female += 1;
        }
        return acc;
    }, { male: 0, female: 0 });

    // Datos para el gráfico
    const chartData = {
        labels: ['Masculino', 'Femenino'],  // Las categorías que se mostrarán en el eje X
        datasets: [
            {
                label: 'Cantidad de Clientes por Sexo',  // Etiqueta de la serie de datos
                data: [sexCount.male, sexCount.female],  // Cantidades de clientes por cada sexo
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'], // Colores para cada barra
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],  // Bordes de las barras
                borderWidth: 1,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: 'white' }
            },
            title: {
                display: true,
                text: '', // Título personalizado
                color: 'white',
                font: { size: 18 },
                align: 'center', // Centrar el título
            }
        },
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                beginAtZero: true,
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
        },
    };

    return (
        <div>
            <h1 className="App App-link">LISTA DE CLIENTES</h1>

            {/* Mostrar errores si ocurren */}
            {error ? (
                <div>Error: {error.message}</div>
            ) : (
                // Mostrar los datos en una tabla estilizada
                <div className="container mt-4">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Clave ISSEMYN</th> {/* Cambiar a Clave ISSEMYN */}
                                <th>Nombre</th> {/* Cambiar a Nombre */}
                                <th>Teléfono</th>
                                <th>Sexo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cliente.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.sexo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mostrar el gráfico con fondo oscuro */}
            <div style={{ width: '50%', margin: '0 auto', backgroundColor: '#333', padding: '20px', borderRadius: '8px' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Cliente;
