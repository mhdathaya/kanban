@echo off
cd /d d:\kanban
echo Installing antd...
npm install antd
echo Installing remaining dependencies...
npm install @dnd-kit/core @dnd-kit/sortable axios react-router-dom zustand
echo Done!
