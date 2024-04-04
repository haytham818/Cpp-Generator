# C++ Class Generator

C++ Class Generator 是一个VS Code扩展，它可以帮助你快速创建C++类。


## 功能

- 创建C++类：输入类名，扩展将为你创建一个头文件和一个源文件。
- 添加到CMakeLists.txt：如果你的工作区中有一个`CMakeLists.txt`文件，扩展可以自动将新创建的类添加到`add_executable`命令中。
- 生成作者注释：扩展可以在生成的文件中添加一个作者注释，包含作者的名字、电子邮箱和当前日期。

## 使用方法

1. 安装扩展。
2. 打开命令面板（`Ctrl+Shift+P`或`Cmd+Shift+P`），然后输入`Create Class`来创建一个新的类,或是在文件资源管理器右键菜单调用。
3. 在弹出的输入框选择生成的种类并中输入你的类名，然后按`Enter`。

## 设置

你可以在VS Code的设置中配置以下选项：

- `cppgenerator.userName`：你的名字，将被添加到生成的文件的作者注释中。
- `cppgenerator.userEmail`：你的电子邮箱，将被添加到生成的文件的作者注释中。
- `cppgenerator.addToCmake`：是否将新创建的类添加到`CMakeLists.txt`文件中。
- `cppgenerator.addHeader`：是否在`CMakeLists.txt`文件中添加头文件。
- `cppgenerator.headerProctectStyel`: 改变头文件保护的样式，#ifdef 或是 #pragma once。

## 贡献

如果你有任何问题或建议，欢迎提交issue或pull request。

## 许可证

这个项目使用MIT许可证，详情请见[LICENSE](LICENSE)文件。

## Github
<https://github.com/haytham818/Cpp-Generator>