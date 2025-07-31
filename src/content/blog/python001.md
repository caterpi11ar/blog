---
title: Python3 核心语法速查
author: caterpillar
pubDatetime: 2025-07-24T00:00:00
featured: false
draft: false
tags:
  - Python
  - 编程语言
  - 学习笔记
  - 基础语法
description: 一份 Python3 学习笔记，从基础语法开始，涵盖数据类型、控制流、函数、面向对象编程等核心概念
---

# Python3 核心语法速查

Python 是一种高级编程语言，以其简洁的语法和强大的功能而闻名。本文档为有编程经验的开发者提供 Python3 的核心语法参考。

## 目录

1. [数据类型](#数据类型)
2. [控制流](#控制流)
3. [函数](#函数)
4. [数据结构](#数据结构)
5. [面向对象编程](#面向对象编程)
6. [异常处理](#异常处理)
7. [文件操作](#文件操作)
8. [模块和包](#模块和包)
9. [实用技巧](#实用技巧)

## 数据类型

### 基本类型

```python
# 数字
int_num = 42
float_num = 3.14
complex_num = 3 + 4j
bool_val = True

# 字符串
str_val = "Hello"
multi_line = """多行
字符串"""

# 序列类型
list_val = [1, 2, 3]
tuple_val = (1, 2, 3)
range_val = range(5)  # 0,1,2,3,4

# 映射类型
dict_val = {"key": "value"}

# 集合类型
set_val = {1, 2, 3}
frozen_set = frozenset([1, 2, 3])
```

### 类型转换

```python
int("123")      # 123
float("3.14")   # 3.14
str(42)         # "42"
list("abc")     # ['a', 'b', 'c']
tuple([1,2,3])  # (1, 2, 3)
set([1,2,2,3])  # {1, 2, 3}
```

## 控制流

### 条件语句

```python
# if-elif-else
if x > 0:
    print("正数")
elif x < 0:
    print("负数")
else:
    print("零")

# 三元运算符
result = "正数" if x > 0 else "非正数"

# 链式比较
if 0 <= x <= 100:
    print("在范围内")
```

### 循环

```python
# for 循环
for i in range(5):
    print(i)

# 遍历列表
for item in [1, 2, 3]:
    print(item)

# 遍历字典
for key, value in {"a": 1, "b": 2}.items():
    print(f"{key}: {value}")

# while 循环
while condition:
    # 循环体
    pass

# 循环控制
for i in range(10):
    if i == 5:
        break      # 跳出循环
    if i == 2:
        continue   # 跳过当前迭代
```

## 函数

### 函数定义

```python
# 基本函数
def greet(name):
    return f"Hello, {name}!"

# 默认参数
def greet_with_default(name="World"):
    return f"Hello, {name}!"

# 可变参数
def sum_all(*args):
    return sum(args)

# 关键字可变参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# 类型注解
def add(a: int, b: int) -> int:
    return a + b
```

### 高级函数特性

```python
# lambda 函数
square = lambda x: x ** 2

# 函数作为参数
def apply_func(func, value):
    return func(value)

result = apply_func(lambda x: x * 2, 5)  # 10

# 装饰器
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"函数 {func.__name__} 执行时间: {end - start}")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
```

## 数据结构

### 列表操作

```python
# 列表推导式
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# 常用方法
lst = [1, 2, 3]
lst.append(4)        # 添加元素
lst.extend([5, 6])   # 扩展列表
lst.insert(0, 0)     # 插入元素
lst.remove(3)        # 删除元素
lst.pop()            # 弹出最后一个元素
lst.sort()           # 排序
lst.reverse()        # 反转
```

### 字典操作

```python
# 字典推导式
squares_dict = {x: x**2 for x in range(5)}

# 常用方法
d = {"a": 1, "b": 2}
d.update({"c": 3})   # 更新字典
d.get("d", 0)        # 安全获取，默认值0
d.setdefault("e", 5) # 设置默认值
d.pop("a")           # 删除并返回
d.clear()            # 清空字典
```

### 集合操作

```python
# 集合运算
set1 = {1, 2, 3}
set2 = {3, 4, 5}

union = set1 | set2          # 并集
intersection = set1 & set2   # 交集
difference = set1 - set2     # 差集
symmetric_diff = set1 ^ set2 # 对称差集
```

## 面向对象编程

### 类定义

```python
class Person:
    # 类变量
    species = "Homo sapiens"
    
    def __init__(self, name, age):
        self.name = name  # 实例变量
        self.age = age
    
    def introduce(self):
        return f"Hi, I'm {self.name}"
    
    @classmethod
    def create_anonymous(cls):
        return cls("Anonymous", 0)
    
    @staticmethod
    def is_adult(age):
        return age >= 18
    
    @property
    def description(self):
        return f"{self.name} ({self.age})"
    
    def __str__(self):
        return f"Person({self.name}, {self.age})"
    
    def __repr__(self):
        return f"Person(name='{self.name}', age={self.age})"
```

### 继承和多态

```python
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

# 多态
animals = [Dog(), Cat()]
for animal in animals:
    print(animal.speak())
```

### 特殊方法

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)
```

## 异常处理

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("除零错误")
except ValueError as e:
    print(f"值错误: {e}")
except Exception as e:
    print(f"其他错误: {e}")
else:
    print("没有异常发生")
finally:
    print("总是执行")

# 自定义异常
class CustomError(Exception):
    pass

# 抛出异常
raise CustomError("自定义错误信息")
```

## 常用内置函数

```python
# 基础函数
len([1, 2, 3])           # 3
type(42)                 # <class 'int'>
isinstance(42, int)      # True
id(obj)                  # 对象ID

# 数学函数
abs(-5)                  # 5
max([1, 2, 3])          # 3
min([1, 2, 3])          # 1
sum([1, 2, 3])          # 6
round(3.14159, 2)       # 3.14

# 序列函数
sorted([3, 1, 4, 1, 5]) # [1, 1, 3, 4, 5]
reversed([1, 2, 3])     # 迭代器
enumerate(['a', 'b'])   # [(0, 'a'), (1, 'b')]
zip([1, 2], ['a', 'b']) # [(1, 'a'), (2, 'b')]

# 函数式编程
map(lambda x: x**2, [1, 2, 3])     # 迭代器
filter(lambda x: x > 0, [-1, 0, 1]) # 迭代器
reduce(lambda x, y: x + y, [1, 2, 3]) # 6 (需要 from functools import reduce)
```

这个简化版本保留了 Python3 的核心语法和实用技巧，去除了过于基础的解释，更适合有编程经验的开发者快速查阅和使用。