

        // Get the draggable div
        const draggable = document.getElementById('controls');

        // Initialize variables for mouse positions and the div's current position
        let offsetX, offsetY, isDragging = false;

        // Event listener to start dragging
        draggable.addEventListener('mousedown', function(e) {
            isDragging = true;

            // Calculate the offset of the mouse position from the top-left corner of the div
            offsetX = e.clientX - draggable.getBoundingClientRect().left;
            offsetY = e.clientY - draggable.getBoundingClientRect().top;

            // Add a "dragging" cursor for better user experience
            draggable.style.cursor = "grabbing";
        });

        // Event listener to handle dragging the div
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                // Update the position of the draggable div based on mouse movements
                draggable.style.left = (e.clientX - offsetX) + 'px';
                draggable.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        // Event listener to stop dragging
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                draggable.style.cursor = "move";  // Reset cursor style when drag ends
            }
        });


        function toggleContent(sectionId) {
            // Hide all content sections
            var sections = document.querySelectorAll('.content');
            sections.forEach(function(section) {
                section.style.display = 'none'; // Hide section
            });

            // Remove "active" class from all menu items
            var menuItems = document.querySelectorAll('#menu a');
            menuItems.forEach(function(item) {
                item.classList.remove('active');
            });

            // Show the clicked content section
            document.getElementById(sectionId).style.display = 'block';

            // Highlight the clicked menu item
            var activeMenuItem = document.querySelector(`#menu a[href="javascript:void(0)"][onclick="toggleContent('${sectionId}')"]`);
            activeMenuItem.classList.add('active');
        }

        // Optionally, you can set the default visible section
        toggleContent('content1');


        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('colorPicker');
        const brushSize = document.getElementById('range');
        const saveBtn = document.getElementById('save-btn');
        const downloadBtn = document.getElementById('download-btn');
        const note = document.getElementById('note');
        const savedImagesContainer = document.getElementById('savedImages');

        let drawing = false;
        let currentColor = colorPicker.value;
        let currentBrushSize = brushSize.value;


        canvas.addEventListener('mousedown', () => {
            drawing = true;
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
            ctx.beginPath();
        });

        canvas.addEventListener('mousemove', draw);

        colorPicker.addEventListener('input', () => {
            currentColor = colorPicker.value;
        });

        brushSize.addEventListener('input', () => {
            currentBrushSize = brushSize.value;
        });

        saveBtn.addEventListener('click', saveImage);

        function draw(event) {
            if (!drawing) return;
            ctx.lineWidth = currentBrushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentColor;

            ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        }


        function saveImage() {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;

            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);

            const imageUrl = tempCanvas.toDataURL('image/jpeg', 1.0);

            const savedImage = { img: imageUrl, note: note.value };
            const savedDiv = document.createElement('div');
            savedDiv.id = 'dis';
            savedDiv.classList.add('saved-image');

            savedDiv.appendChild(document.createElement('br'));
            
            const imgElement = document.createElement('img');
            imgElement.src = savedImage.img;
            savedDiv.appendChild(imgElement);

            const noteElement = document.createElement('p');
            noteElement.textContent = savedImage.note || "No note added";
            savedDiv.appendChild(noteElement);

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download';
            downloadBtn.onclick = () => downloadImage(savedImage.img);
            savedDiv.appendChild(downloadBtn);

            savedImagesContainer.appendChild(savedDiv);

            note.value = ''; // Reset the note field
        }

        function downloadImage(imageUrl) {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = 'drawing.jpg';
            a.click();
        }

        function toggleContent(contentId) {
            const contents = document.querySelectorAll('.content');
            contents.forEach(content => content.style.display = 'none');
            const selectedContent = document.getElementById(contentId);
            selectedContent.style.display = 'block';
        }

        function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clears the entire canvas
    undoStack = [];  // Clear the undo stack
    redoStack = [];  // Clear the redo stack
    drawing = false;  // Reset the drawing state
}
    