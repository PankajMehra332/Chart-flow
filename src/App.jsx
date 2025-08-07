import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import React, { useState, useCallback, useRef, useEffect } from 'react';

function TableModal({ isOpen, onClose, onInsert }) {
	const [rows, setRows] = useState(3);
	const [columns, setColumns] = useState(3);
	
	const handleInsert = () => {
		onInsert({ rows, columns })
		onClose()
	}
	
	if (!isOpen) return null
	
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
			onClick={onClose}
		>
			<div
				style={{
					backgroundColor: 'white',
					padding: '24px',
					borderRadius: '8px',
					minWidth: '300px',
					boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Insert Table</h3>
				
				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
						Rows:
					</label>
					<input
						type="number"
						min="1"
						max="10"
						value={rows}
						onChange={(e) => setRows(parseInt(e.target.value) || 1)}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ddd',
							borderRadius: '4px',
						}}
					/>
				</div>
				
				<div style={{ marginBottom: '24px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
						Columns:
					</label>
					<input
						type="number"
						min="1"
						max="10"
						value={columns}
						onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ddd',
							borderRadius: '4px',
						}}
					/>
				</div>
				
				<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
					<button
						onClick={onClose}
						style={{
							padding: '8px 16px',
							border: '1px solid #ddd',
							borderRadius: '4px',
							backgroundColor: 'white',
							cursor: 'pointer',
						}}
					>
						Cancel
					</button>
					<button
						onClick={handleInsert}
						style={{
							padding: '8px 16px',
							border: 'none',
							borderRadius: '4px',
							backgroundColor: '#007bff',
							color: 'white',
							cursor: 'pointer',
						}}
					>
						Insert Table
					</button>
				</div>
			</div>
		</div>
	)
}

function CustomToolbar({ onInsertTable, onInsertChart }) {
	return (
		<div
			style={{
				position: 'absolute',
				top: '1px',
				left: '300px',
				zIndex: 100,
				backgroundColor: 'white',
				border: '1px solid #ddd',
				borderRadius: '8px',
				padding: '2px',
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
				display: 'flex',
				gap: '4px',
			}}
		>
			<button
				onClick={onInsertTable}
				style={{
					padding: '8px 12px',
					border: 'none',
					borderRadius: '4px',
					backgroundColor: '#007bff',
					color: 'white',
					cursor: 'pointer',
					fontSize: '14px',
					display: 'flex',
					alignItems: 'center',
					gap: '6px',
				}}
			>
				📊 Insert Table
			</button>
			<button
				onClick={onInsertChart}
				style={{
					padding: '8px 12px',
					border: 'none',
					borderRadius: '4px',
					backgroundColor: '#28a745',
					color: 'white',
					cursor: 'pointer',
					fontSize: '14px',
					display: 'flex',
					alignItems: 'center',
					gap: '6px',
				}}
			>
				📈 Insert Chart
			</button>
		</div>
	)
}

function TableComponent({ rows, columns, x, y, cellWidth = 150, cellHeight = 40 }) {
	const [cellData, setCellData] = useState(() => {
		const data = {}
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				data[`${r}-${c}`] = ''
			}
		}
		return data
	})
	
	const [editingCell, setEditingCell] = useState(null)
	const [columnWidths, setColumnWidths] = useState(() => 
		Array(columns).fill(cellWidth)
	)
	const [rowHeights, setRowHeights] = useState(() => 
		Array(rows).fill(cellHeight)
	)
	const [isResizing, setIsResizing] = useState(false)
	const [resizeType, setResizeType] = useState(null) // 'column', 'row', 'table'
	const [resizeIndex, setResizeIndex] = useState(null)
	const [tableWidth, setTableWidth] = useState(columns * cellWidth)
	const [tableHeight, setTableHeight] = useState(rows * cellHeight)
	const [tablePosition, setTablePosition] = useState({ x, y })
	const [isDragging, setIsDragging] = useState(false)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	
	const tableRef = useRef(null)
	
	const handleCellChange = (row, col, value) => {
		setCellData(prev => ({
			...prev,
			[`${row}-${col}`]: value
		}))
	}
	
	const handleCellClick = (row, col) => {
		setEditingCell(`${row}-${col}`)
	}
	
	const handleCellBlur = () => {
		setEditingCell(null)
	}
	
	const handleKeyDown = (e, row, col) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			setEditingCell(null)
		} else if (e.key === 'Tab') {
			e.preventDefault()
			const nextCol = col + 1
			const nextRow = nextCol >= columns ? row + 1 : row
			const newCol = nextCol >= columns ? 0 : nextCol
			
			if (nextRow < rows) {
				setEditingCell(`${nextRow}-${newCol}`)
			} else {
				setEditingCell(null)
			}
		}
	}
	
	// Column resize handlers
	const handleColumnResizeStart = (e, colIndex) => {
		e.preventDefault()
		e.stopPropagation()
		setIsResizing(true)
		setResizeType('column')
		setResizeIndex(colIndex)
	}
	
	const handleColumnResize = (e) => {
		if (!isResizing || resizeType !== 'column') return
		
		const rect = tableRef.current.getBoundingClientRect()
		const leftOffset = columnWidths.slice(0, resizeIndex).reduce((sum, width) => sum + width, 0)
		const newWidth = e.clientX - rect.left - leftOffset
		
		if (newWidth > 50) { // Minimum width
			setColumnWidths(prev => {
				const newWidths = [...prev]
				newWidths[resizeIndex] = newWidth
				return newWidths
			})
			
			// Update table width
			const newWidths = [...columnWidths]
			newWidths[resizeIndex] = newWidth
			const totalWidth = newWidths.reduce((sum, width) => sum + width, 0)
			setTableWidth(totalWidth)
		}
	}
	
	// Row resize handlers
	const handleRowResizeStart = (e, rowIndex) => {
		e.preventDefault()
		e.stopPropagation()
		setIsResizing(true)
		setResizeType('row')
		setResizeIndex(rowIndex)
	}
	
	const handleRowResize = (e) => {
		if (!isResizing || resizeType !== 'row') return
		
		const rect = tableRef.current.getBoundingClientRect()
		const topOffset = rowHeights.slice(0, resizeIndex).reduce((sum, height) => sum + height, 0)
		const newHeight = e.clientY - rect.top - topOffset
		
		if (newHeight > 30) { // Minimum height
			setRowHeights(prev => {
				const newHeights = [...prev]
				newHeights[resizeIndex] = newHeight
				return newHeights
			})
			
			// Update table height
			const newHeights = [...rowHeights]
			newHeights[resizeIndex] = newHeight
			const totalHeight = newHeights.reduce((sum, height) => sum + height, 0)
			setTableHeight(totalHeight)
		}
	}
	
	// Table resize handlers
	const handleTableResizeStart = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setIsResizing(true)
		setResizeType('table')
		setDragOffset({
			x: e.clientX - tablePosition.x,
			y: e.clientY - tablePosition.y
		})
	}
	
	const handleTableResize = (e) => {
		if (!isResizing || resizeType !== 'table') return
		
		const newWidth = e.clientX - tablePosition.x
		const newHeight = e.clientY - tablePosition.y
		
		if (newWidth > 200 && newHeight > 100) { // Minimum table size
			setTableWidth(newWidth)
			setTableHeight(newHeight)
			
			// Adjust column widths proportionally
			const avgColumnWidth = newWidth / columns
			setColumnWidths(Array(columns).fill(avgColumnWidth))
			
			// Adjust row heights proportionally
			const avgRowHeight = newHeight / rows
			setRowHeights(Array(rows).fill(avgRowHeight))
		}
	}
	
	// Table drag handlers
	const handleTableDragStart = (e) => {
		if (e.target.closest('.resize-handle') || e.target.closest('.cell-input')) return
		
		e.preventDefault()
		setIsDragging(true)
		setDragOffset({
			x: e.clientX - tablePosition.x,
			y: e.clientY - tablePosition.y
		})
	}
	
	const handleTableDrag = (e) => {
		if (!isDragging) return
		
		setTablePosition({
			x: e.clientX - dragOffset.x,
			y: e.clientY - dragOffset.y
		})
	}
	
	const handleMouseUp = () => {
		setIsResizing(false)
		setIsDragging(false)
		setResizeType(null)
		setResizeIndex(null)
	}
	
	// Add global mouse event listeners
	React.useEffect(() => {
		if (isResizing || isDragging) {
			const handleMouseMove = (e) => {
				if (resizeType === 'column') {
					handleColumnResize(e)
				} else if (resizeType === 'row') {
					handleRowResize(e)
				} else if (resizeType === 'table') {
					handleTableResize(e)
				} else if (isDragging) {
					handleTableDrag(e)
				}
			}
			
			const handleMouseUpGlobal = () => {
				handleMouseUp()
			}
			
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUpGlobal)
			
			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUpGlobal)
			}
		}
	}, [isResizing, isDragging, resizeType, resizeIndex, dragOffset])
	
	return (
		<div
			ref={tableRef}
			className={isResizing ? 'table-resizing' : ''}
			style={{
				position: 'absolute',
				left: tablePosition.x,
				top: tablePosition.y,
				border: '2px solid #333',
				backgroundColor: 'white',
				borderRadius: '4px',
				overflow: 'hidden',
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
				width: tableWidth,
				height: tableHeight,
				cursor: isDragging ? 'grabbing' : (isResizing ? 'default' : 'grab'),
			}}
			onMouseDown={handleTableDragStart}
		>
			{/* Column resize handles */}
			{Array.from({ length: columns - 1 }, (_, col) => (
				<div
					key={`col-resize-${col}`}
					className="resize-handle column-resize"
					style={{
						position: 'absolute',
						top: 0,
						left: columnWidths.slice(0, col + 1).reduce((sum, width) => sum + width, 0) - 2,
						width: '4px',
						height: '100%',
						backgroundColor: 'transparent',
						cursor: 'col-resize',
						zIndex: 10,
					}}
					onMouseDown={(e) => handleColumnResizeStart(e, col + 1)}
				>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '2px',
							height: '20px',
							backgroundColor: '#007bff',
							borderRadius: '1px',
						}}
					/>
				</div>
			))}
			
			{/* Row resize handles */}
			{Array.from({ length: rows - 1 }, (_, row) => (
				<div
					key={`row-resize-${row}`}
					className="resize-handle row-resize"
					style={{
						position: 'absolute',
						top: rowHeights.slice(0, row + 1).reduce((sum, height) => sum + height, 0) - 2,
						left: 0,
						width: '100%',
						height: '4px',
						backgroundColor: 'transparent',
						cursor: 'row-resize',
						zIndex: 10,
					}}
					onMouseDown={(e) => handleRowResizeStart(e, row + 1)}
				>
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '20px',
							height: '2px',
							backgroundColor: '#007bff',
							borderRadius: '1px',
						}}
					/>
				</div>
			))}
			
			{/* Table resize handle */}
			<div
				className="resize-handle table-resize"
				style={{
					position: 'absolute',
					bottom: '-6px',
					right: '-6px',
					width: '12px',
					height: '12px',
					backgroundColor: '#007bff',
					borderRadius: '2px',
					cursor: 'nw-resize',
					zIndex: 10,
				}}
				onMouseDown={handleTableResizeStart}
			/>
			
			{/* Table cells */}
			{Array.from({ length: rows }, (_, row) => (
				<div key={row} style={{ display: 'flex' }}>
					{Array.from({ length: columns }, (_, col) => {
						const cellKey = `${row}-${col}`
						const isEditing = editingCell === cellKey
						const isHeader = row === 0
						
						return (
							<div
								key={col}
								style={{
									width: columnWidths[col],
									height: rowHeights[row],
									border: '1px solid #ddd',
									borderTop: row === 0 ? 'none' : '1px solid #ddd',
									borderLeft: col === 0 ? 'none' : '1px solid #ddd',
									backgroundColor: isHeader ? '#f8f9fa' : 'white',
									position: 'relative',
									display: 'flex',
									alignItems: 'center',
									padding: '0 8px',
								}}
								onClick={() => handleCellClick(row, col)}
							>
								{isEditing ? (
									<input
										type="text"
										className="cell-input"
										value={cellData[cellKey] || ''}
										onChange={(e) => handleCellChange(row, col, e.target.value)}
										onBlur={handleCellBlur}
										onKeyDown={(e) => handleKeyDown(e, row, col)}
										style={{
											width: '100%',
											border: 'none',
											outline: 'none',
											backgroundColor: 'transparent',
											fontSize: '14px',
											fontWeight: isHeader ? 'bold' : 'normal',
										}}
										autoFocus
									/>
								) : (
									<span
										style={{
											fontSize: '14px',
											fontWeight: isHeader ? 'bold' : 'normal',
											color: cellData[cellKey] ? '#333' : '#999',
											cursor: 'text',
											width: '100%',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{cellData[cellKey] || (isHeader ? `Header ${col + 1}` : 'Click to edit')}
									</span>
								)}
							</div>
						)
					})}
				</div>
			))}
		</div>
	)
}

function ChartModal({ isOpen, onClose, onInsert }) {
	const [chartType, setChartType] = useState('bar')
	const [chartData, setChartData] = useState([
		{ label: 'Category 1', value: 10 },
		{ label: 'Category 2', value: 20 },
		{ label: 'Category 3', value: 15 },
		{ label: 'Category 4', value: 25 },
	])
	const [title, setTitle] = useState('Chart Title')
	
	const handleInsert = () => {
		onInsert({ 
			type: chartType, 
			data: chartData, 
			title 
		})
		onClose()
	}
	
	const addDataPoint = () => {
		setChartData(prev => [...prev, { label: `Category ${prev.length + 1}`, value: 0 }])
	}
	
	const updateDataPoint = (index, field, value) => {
		setChartData(prev => prev.map((item, i) => 
			i === index ? { ...item, [field]: value } : item
		))
	}
	
	const removeDataPoint = (index) => {
		setChartData(prev => prev.filter((_, i) => i !== index))
	}
	
	if (!isOpen) return null
	
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
			onClick={onClose}
		>
			<div
				style={{
					backgroundColor: 'white',
					padding: '24px',
					borderRadius: '8px',
					minWidth: '500px',
					maxWidth: '600px',
					maxHeight: '80vh',
					overflow: 'auto',
					boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Create Chart</h3>
				
				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
						Chart Title:
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ddd',
							borderRadius: '4px',
						}}
					/>
				</div>
				
				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
						Chart Type:
					</label>
					<select
						value={chartType}
						onChange={(e) => setChartType(e.target.value)}
						style={{
							width: '100%',
							padding: '8px',
							border: '1px solid #ddd',
							borderRadius: '4px',
						}}
					>
						<option value="bar">Bar Chart</option>
						<option value="line">Line Chart</option>
						<option value="pie">Pie Chart</option>
					</select>
				</div>
				
				<div style={{ marginBottom: '16px' }}>
					<label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
						Chart Data:
					</label>
					<div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ backgroundColor: '#f8f9fa' }}>
									<th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Label</th>
									<th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Value</th>
									<th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Action</th>
								</tr>
							</thead>
							<tbody>
								{chartData.map((item, index) => (
									<tr key={index}>
										<td style={{ padding: '8px', border: '1px solid #ddd' }}>
											<input
												type="text"
												value={item.label}
												onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
												style={{
													width: '100%',
													padding: '4px',
													border: 'none',
													outline: 'none',
												}}
											/>
										</td>
										<td style={{ padding: '8px', border: '1px solid #ddd' }}>
											<input
												type="number"
												value={item.value}
												onChange={(e) => updateDataPoint(index, 'value', parseFloat(e.target.value) || 0)}
												style={{
													width: '100%',
													padding: '4px',
													border: 'none',
													outline: 'none',
												}}
											/>
										</td>
										<td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
											<button
												onClick={() => removeDataPoint(index)}
												style={{
													padding: '2px 6px',
													border: 'none',
													backgroundColor: '#dc3545',
													color: 'white',
													borderRadius: '3px',
													cursor: 'pointer',
													fontSize: '12px',
												}}
											>
												×
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<button
						onClick={addDataPoint}
						style={{
							marginTop: '8px',
							padding: '6px 12px',
							border: '1px solid #007bff',
							backgroundColor: 'white',
							color: '#007bff',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						+ Add Data Point
					</button>
				</div>
				
				<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
					<button
						onClick={onClose}
						style={{
							padding: '8px 16px',
							border: '1px solid #ddd',
							borderRadius: '4px',
							backgroundColor: 'white',
							cursor: 'pointer',
						}}
					>
						Cancel
					</button>
					<button
						onClick={handleInsert}
						style={{
							padding: '8px 16px',
							border: 'none',
							borderRadius: '4px',
							backgroundColor: '#007bff',
							color: 'white',
							cursor: 'pointer',
						}}
					>
						Create Chart
					</button>
				</div>
			</div>
		</div>
	)
}

function ChartComponent({ type, data, title, x, y, width = 400, height = 300 }) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [position, setPosition] = useState({ x, y });
	const [size, setSize] = useState({ width, height });
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const chartRef = useRef(null);
	const maxValue = Math.max(...data.map(item => item.value));
	const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];
	
	const handleDragStart = (e) => {
		if (e.target.closest('.resize-handle')) return
		
		e.preventDefault()
		setIsDragging(true)
		setDragOffset({
			x: e.clientX - position.x,
			y: e.clientY - position.y
		})
	}
	
	const handleDrag = (e) => {
		if (!isDragging) return
		
		setPosition({
			x: e.clientX - dragOffset.x,
			y: e.clientY - dragOffset.y
		})
	}
	
	const handleResizeStart = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setIsResizing(true)
		setDragOffset({
			x: e.clientX - size.width,
			y: e.clientY - size.height
		})
	}
	
	const handleResize = (e) => {
		if (!isResizing) return
		
		const newWidth = e.clientX - position.x
		const newHeight = e.clientY - position.y
		
		if (newWidth > 200 && newHeight > 150) {
			setSize({ width: newWidth, height: newHeight })
		}
	}
	
	const handleMouseUp = () => {
		setIsDragging(false)
		setIsResizing(false)
	}
	
	useEffect(() => {
		if (isDragging || isResizing) {
			const handleMouseMove = (e) => {
				if (isDragging) {
					handleDrag(e)
				} else if (isResizing) {
					handleResize(e)
				}
			}
			
			const handleMouseUpGlobal = () => {
				handleMouseUp()
			}
			
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUpGlobal)
			
			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUpGlobal)
			}
		}
	}, [isDragging, isResizing, dragOffset])
	
	const renderBarChart = () => {
		const barWidth = (size.width - 80) / data.length
		const maxBarHeight = size.height - 80
		
		return (
			<svg width={size.width} height={size.height}>
				{/* Title */}
				<text x={size.width / 2} y="20" textAnchor="middle" fontSize="16" fontWeight="bold">
					{title}
				</text>
				
				{/* Bars */}
				{data.map((item, index) => {
					const barHeight = (item.value / maxValue) * maxBarHeight
					const x = 40 + index * barWidth + barWidth / 2
					const y = size.height - 40 - barHeight
					
					return (
						<g key={index}>
							<rect
								x={x - barWidth / 2 + 5}
								y={y}
								width={barWidth - 10}
								height={barHeight}
								fill={colors[index % colors.length]}
								rx="2"
							/>
							<text
								x={x}
								y={y - 5}
								textAnchor="middle"
								fontSize="12"
								fill="#333"
							>
								{item.value}
							</text>
							<text
								x={x}
								y={size.height - 20}
								textAnchor="middle"
								fontSize="10"
								fill="#666"
							>
								{item.label}
							</text>
						</g>
					)
				})}
				
				{/* Y-axis */}
				<line x1="40" y1="40" x2="40" y2={size.height - 40} stroke="#ccc" strokeWidth="1" />
				<line x1="40" y1={size.height - 40} x2={size.width - 40} y2={size.height - 40} stroke="#ccc" strokeWidth="1" />
			</svg>
		)
	}
	
	const renderLineChart = () => {
		const chartWidth = size.width - 80
		const chartHeight = size.height - 80
		const pointSpacing = chartWidth / (data.length - 1)
		
		const points = data.map((item, index) => ({
			x: 40 + index * pointSpacing,
			y: size.height - 40 - (item.value / maxValue) * chartHeight
		}))
		
		const pathData = points.map((point, index) => 
			`${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
		).join(' ')
		
		return (
			<svg width={size.width} height={size.height}>
				{/* Title */}
				<text x={size.width / 2} y="20" textAnchor="middle" fontSize="16" fontWeight="bold">
					{title}
				</text>
				
				{/* Line */}
				<path d={pathData} stroke="#007bff" strokeWidth="2" fill="none" />
				
				{/* Points */}
				{points.map((point, index) => (
					<g key={index}>
						<circle
							cx={point.x}
							cy={point.y}
							r="4"
							fill="#007bff"
						/>
						<text
							x={point.x}
							y={point.y - 10}
							textAnchor="middle"
							fontSize="12"
							fill="#333"
						>
							{data[index].value}
						</text>
						<text
							x={point.x}
							y={size.height - 20}
							textAnchor="middle"
							fontSize="10"
							fill="#666"
						>
							{data[index].label}
						</text>
					</g>
				))}
				
				{/* Axes */}
				<line x1="40" y1="40" x2="40" y2={size.height - 40} stroke="#ccc" strokeWidth="1" />
				<line x1="40" y1={size.height - 40} x2={size.width - 40} y2={size.height - 40} stroke="#ccc" strokeWidth="1" />
			</svg>
		)
	}
	
	const renderPieChart = () => {
		const centerX = size.width / 2
		const centerY = size.height / 2
		const radius = Math.min(size.width, size.height) / 3
		
		const total = data.reduce((sum, item) => sum + item.value, 0)
		let currentAngle = 0
		
		return (
			<svg width={size.width} height={size.height}>
				{/* Title */}
				<text x={size.width / 2} y="30" textAnchor="middle" fontSize="16" fontWeight="bold">
					{title}
				</text>
				
				{/* Pie slices */}
				{data.map((item, index) => {
					const sliceAngle = (item.value / total) * 2 * Math.PI
					const startAngle = currentAngle
					const endAngle = currentAngle + sliceAngle
					
					const x1 = centerX + radius * Math.cos(startAngle)
					const y1 = centerY + radius * Math.sin(startAngle)
					const x2 = centerX + radius * Math.cos(endAngle)
					const y2 = centerY + radius * Math.sin(endAngle)
					
					const largeArcFlag = sliceAngle > Math.PI ? 1 : 0
					
					const pathData = [
						`M ${centerX} ${centerY}`,
						`L ${x1} ${y1}`,
						`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
						'Z'
					].join(' ')
					
					currentAngle += sliceAngle
					
					const labelAngle = startAngle + sliceAngle / 2
					const labelRadius = radius + 20
					const labelX = centerX + labelRadius * Math.cos(labelAngle)
					const labelY = centerY + labelRadius * Math.sin(labelAngle)
					
					return (
						<g key={index}>
							<path
								d={pathData}
								fill={colors[index % colors.length]}
								stroke="white"
								strokeWidth="2"
							/>
							<text
								x={labelX}
								y={labelY}
								textAnchor="middle"
								fontSize="12"
								fill="#333"
							>
								{`${item.label} (${Math.round((item.value / total) * 100)}%)`}
							</text>
						</g>
					)
				})}
			</svg>
		)
	}
	
	const renderChart = () => {
		switch (type) {
			case 'bar':
				return renderBarChart()
			case 'line':
				return renderLineChart()
			case 'pie':
				return renderPieChart()
			default:
				return renderBarChart()
		}
	}
	
	return (
		<div
			ref={chartRef}
			style={{
				position: 'absolute',
				left: position.x,
				top: position.y,
				border: '2px solid #333',
				backgroundColor: 'white',
				borderRadius: '8px',
				overflow: 'hidden',
				boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
				width: size.width,
				height: size.height,
				cursor: isDragging ? 'grabbing' : 'grab',
			}}
			onMouseDown={handleDragStart}
		>
			<div
				className="resize-handle chart-resize"
				style={{
					position: 'absolute',
					bottom: '-6px',
					right: '-6px',
					width: '12px',
					height: '12px',
					backgroundColor: '#007bff',
					borderRadius: '2px',
					cursor: 'nw-resize',
					zIndex: 10,
				}}
				onMouseDown={handleResizeStart}
			/>
			{renderChart()}
		</div>
	)
}

export default function App() {
	const [isTableModalOpen, setIsTableModalOpen] = useState(false)
	const [isChartModalOpen, setIsChartModalOpen] = useState(false)
	const [tables, setTables] = useState([])
	const [charts, setCharts] = useState([])
	
	const handleInsertTable = useCallback(({ rows, columns }) => {
		const newTable = {
			id: Date.now(),
			rows,
			columns,
			x: 100 + tables.length * 50,
			y: 100 + tables.length * 50,
		}
		setTables(prev => [...prev, newTable])
	}, [tables.length])
	
	const handleInsertChart = useCallback(({ type, data, title }) => {
		const newChart = {
			id: Date.now(),
			type,
			data,
			title,
			x: 100 + charts.length * 50,
			y: 100 + charts.length * 50,
		}	
		setCharts(prev => [...prev, newChart])
	}, [charts.length])
	
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw />
			{tables.map(table => (
				<TableComponent
					key={table.id}
					rows={table.rows}
					columns={table.columns}
					x={table.x}
					y={table.y}
				/>
			))}
			{charts.map(chart => (
				<ChartComponent
					key={chart.id}
					type={chart.type}
					data={chart.data}
					title={chart.title}
					x={chart.x}
					y={chart.y}
				/>
			))}
			
			<CustomToolbar 
				onInsertTable={() => setIsTableModalOpen(true)}
				onInsertChart={() => setIsChartModalOpen(true)}
			/>
			<TableModal
				isOpen={isTableModalOpen}
				onClose={() => setIsTableModalOpen(false)}
				onInsert={handleInsertTable}
			/>
			<ChartModal
				isOpen={isChartModalOpen}
				onClose={() => setIsChartModalOpen(false)}
				onInsert={handleInsertChart}
			/>
		</div>
	)
}