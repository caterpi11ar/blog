---
title: Python 学习小记 (最终修订版)
author: caterpillar
pubDatetime: 2025-07-24T00:00:00
featured: false
draft: false
tags:
  - Python
  - 编程语言
  - 学习笔记
  - 基础语法
description: 一份最终修订的 Python 速查笔记，为每个函数和方法提供了丰富的、多场景的实用示例，旨在帮助开发者真正理解和掌握 Python 的核心用法。
---

# Python 语法速查 (最终修订版)

本笔记旨在为开发者提供一份内容详尽、示例丰富的 Python 语法参考。每个知识点都配有多种使用场景，帮助您深入理解，而不仅仅是浅尝辄止。

## 目录

1.  [核心数据类型](#核心数据类型)
2.  [控制流](#控制流)
3.  [函数 (深入理解)](#函数-深入理解)
4.  [常用内置函数 (多场景示例)](#常用内置函数-多场景示例)
5.  [数据结构与方法详解](#数据结构与方法详解)
6.  [面向对象编程 (OOP)](#面向对象编程-oop)
7.  [异常处理](#异常处理)
8.  [文件操作](#文件操作)
9.  [模块和包](#模块和包)
10. [高级技巧](#高级技巧)

---

## 核心数据类型

-   **int**: `42`
-   **float**: `3.14`
-   **bool**: `True`, `False`
-   **str**: `"Hello"`, `'World'`, `'''多行字符串'''`
-   **NoneType**: `None`
-   **list**: `[1, "apple", True]` (有序，可变)
-   **tuple**: `(1, "apple", True)` (有序，不可变)
-   **dict**: `{"key": "value", "age": 25}` (键值对，可变)
-   **set**: `{1, 2, 3}` (无序，不重复，可变)

---

## 控制流

### 条件语句

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"

print(f"分数 {score} 对应的等级是: {grade}") # => B

# 三元运算符
status = "及格" if score >= 60 else "不及格"
print(status) # => 及格
```

### 循环

```python
# For 循环
print("--- 遍历列表 ---")
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

print("\n--- 遍历字典 ---")
student = {"name": "Alice", "age": 25}
for key, value in student.items():
    print(f"{key.title()}: {value}")

# While 循环
import random
target_num = 5
while True:
    guess = random.randint(1, 10)
    print(f"我猜是: {guess}")
    if guess == target_num:
        print("猜对了!")
        break # 猜对时跳出循环
```

---

## 函数 (深入理解)

### 定义与参数

```python
# 混合使用默认、位置和可变参数
def create_profile(username, email, age=None, *interests, **details):
    """
    创建一个用户资料。
    - username, email: 必需的位置参数。
    - age: 可选参数。
    - *interests: 接收任意数量的兴趣爱好（元组）。
    - **details: 接收任意数量的其他信息（字典）。
    """
    profile = {
        "username": username,
        "email": email,
    }
    if age:
        profile["age"] = age
    if interests:
        profile["interests"] = interests
    if details:
        profile.update(details)
    return profile

# 使用示例
profile1 = create_profile("Alice", "alice@example.com", 25, "reading", "coding", city="New York", status="active")
print(profile1)
# 输出: {'username': 'Alice', 'email': 'alice@example.com', 'age': 25, 'interests': ('reading', 'coding'), 'city': 'New York', 'status': 'active'}

profile2 = create_profile("Bob", "bob@example.com", "music", "sports", country="Canada")
print(profile2)
# 输出: {'username': 'Bob', 'email': 'bob@example.com', 'interests': ('music', 'sports'), 'country': 'Canada'}
```

### Lambda (匿名函数)

```python
# 基础用法
add = lambda x, y: x + y
print(add(5, 3)) # => 8

# 作为高阶函数的参数
# 场景1: 排序
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 85},
]
# 按分数降序，分数相同则按名字升序
students.sort(key=lambda s: (-s["score"], s["name"]))
print(students)
# 输出: [{'name': 'Bob', 'score': 92}, {'name': 'Alice', 'score': 85}, {'name': 'Charlie', 'score': 85}]

# 场景2: map & filter
nums = [1, 2, 3, 4, 5, 6]
# 筛选出偶数，并计算它们的平方
even_squares = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, nums)))
print(even_squares) # => [4, 16, 36]
```

---

## 常用内置函数 (多场景示例)

### `sorted(iterable, key=None, reverse=False)`

返回一个新的已排序列表，不改变原始对象。

```python
# 基础排序
nums = [3, 1, 4, 1, 5]
print(f"排序后: {sorted(nums)}") # => [1, 1, 3, 4, 5]
print(f"降序: {sorted(nums, reverse=True)}") # => [5, 4, 3, 1, 1]
print(f"原始列表不变: {nums}") # => [3, 1, 4, 1, 5]

# 高级排序
words = ["apple", "Banana", "cherry", "Date"]
# 按小写字母排序
print(sorted(words, key=str.lower)) # => ['apple', 'Banana', 'cherry', 'Date']
# 按字符串长度排序
print(sorted(words, key=len)) # => ['Date', 'apple', 'Banana', 'cherry']
```

### `enumerate(iterable, start=0)`

返回一个产生 `(索引, 值)` 元组的迭代器。

```python
# 默认从 0 开始
fruits = ['apple', 'banana', 'cherry']
for index, fruit in enumerate(fruits):
    print(f"索引 {index}: {fruit}")

# 自定义起始索引
print("\n--- 从 1 开始 ---")
for i, fruit in enumerate(fruits, start=1):
    print(f"第 {i} 个水果是: {fruit}")
```

### `zip(*iterables)`

将多个可迭代对象“压缩”成一个元组的迭代器。

```python
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
cities = ['New York', 'London'] # 长度最短

# 基础用法 (长度由最短的决定)
zipped_data = zip(names, ages, cities)
print(f"压缩后的列表: {list(zipped_data)}") # => [('Alice', 25, 'New York'), ('Bob', 30, 'London')]

# "解压"操作
data = [('Alice', 25), ('Bob', 30)]
unzipped_names, unzipped_ages = zip(*data)
print(f"解压后的名字: {unzipped_names}") # => ('Alice', 'Bob')
print(f"解压后的年龄: {unzipped_ages}") # => (25, 30)
```

---

## 数据结构与方法详解

### 列表 `list` (可变)

```python
# append vs extend
lst = [1, 2]
lst.append([3, 4]) # 将整个对象 [3, 4] 作为一个元素添加
print(f"append 后: {lst}") # => [1, 2, [3, 4]]

lst = [1, 2]
lst.extend([3, 4]) # 将 [3, 4] 中的每个元素逐个添加
print(f"extend 后: {lst}") # => [1, 2, 3, 4]

# sort (原地修改)
points = [(4, 1), (2, 5), (1, 3)]
points.sort(key=lambda p: p[1]) # 按 y 坐标排序
print(f"sort 后: {points}") # => [(4, 1), (1, 3), (2, 5)]

# pop
items = ['a', 'b', 'c']
last_item = items.pop() # 弹出最后一个
print(f"弹出的元素: {last_item}, 剩余列表: {items}") # => 'c', ['a', 'b']
first_item = items.pop(0) # 按索引弹出
print(f"弹出的元素: {first_item}, 剩余列表: {items}") # => 'a', ['b']
```

### 字典 `dict` (可变)

```python
# get (安全获取)
d = {"name": "Alice"}
print(d.get("name")) # => "Alice"
print(d.get("age")) # => None (不存在，返回 None)
print(d.get("age", 25)) # => 25 (不存在，返回指定的默认值)

# update (合并字典)
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
d1.update(d2) # d2 中的键值对覆盖/添加到 d1
print(f"update 后: {d1}") # => {'a': 1, 'b': 3, 'c': 4}
```

### 集合 `set` (可变)

```python
# remove vs discard
s = {1, 2, 3}
s.remove(2) # 存在，正常删除
# s.remove(4) # 不存在，会引发 KeyError
s.discard(3) # 存在，正常删除
s.discard(4) # 不存在，不会报错
print(f"操作后: {s}") # => {1}

# 集合运算
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(f"并集 (a | b): {a.union(b)}") # => {1, 2, 3, 4, 5, 6}
print(f"交集 (a & b): {a.intersection(b)}") # => {3, 4}
print(f"差集 (a - b): {a.difference(b)}") # => {1, 2}
print(f"对称差集 (a ^ b): {a.symmetric_difference(b)}") # => {1, 2, 5, 6}
```

---

## 面向对象编程 (OOP)

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):
        """用于 print() 和 str()，面向用户"""
        return f'"{self.title}" by {self.author}'

    def __repr__(self):
        """用于调试和开发，应能重建对象"""
        return f"Book(title='{self.title}', author='{self.author}')"

book = Book("The Hitchhiker's Guide to the Galaxy", "Douglas Adams")
print(book) # 调用 __str__
# 输出: "The Hitchhiker's Guide to the Galaxy" by Douglas Adams

print([book]) # 在容器中，调用 __repr__
# 输出: [Book(title='The Hitchhiker's Guide to the Galaxy', author='Douglas Adams')]
```

---

## 异常处理

```python
def get_inverse(x):
    try:
        return 1 / x
    except TypeError:
        print("错误: 输入必须是数字。")
        return None
    except ZeroDivisionError:
        print("错误: 不能输入零。")
        return float('inf') # 返回无穷大作为特殊处理

print(get_inverse(5))    # => 0.2
print(get_inverse(0))    # => inf
print(get_inverse("a"))  # => None
```

---

## 文件操作

```python
# 写入多行
lines_to_write = ["第一行\n", "第二行\n", "第三行\n"]
with open("mylog.txt", "w", encoding="utf-8") as f:
    f.writelines(lines_to_write)

# 读取所有行到列表中
with open("mylog.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
    print(f"读取到的行: {lines}")
    # => ['第一行\n', '第二行\n', '第三行\n']
```

---

## 模块和包

-   **模块**: 一个 `.py` 文件。
-   **包**: 一个包含 `__init__.py` 文件的目录。

```python
# 推荐的导入方式
import math
from collections import defaultdict

# 不推荐的方式 (容易造成命名冲突)
# from math import *
```

---

## 高级技巧

### 列表/字典/集合推导式

```python
# 列表推导式：生成一个包含前10个偶数的平方的列表
squares = [x**2 for x in range(20) if x % 2 == 0][:10]
print(squares)

# 字典推导式：从列表中创建字典，值为其长度
words = ['apple', 'banana', 'cherry']
word_lengths = {word: len(word) for word in words}
print(word_lengths) # => {'apple': 5, 'banana': 6, 'cherry': 6}
```

### 生成器

```python
# 生成器表达式：语法类似列表推导式，但使用圆括号
# 它不立即计算，而是返回一个生成器对象，节省内存
large_range_squares = (x**2 for x in range(1000000))
# print(large_range_squares) # <generator object <genexpr> at ...>
# for i, num in enumerate(large_range_squares):
#     if i >= 5: break
#     print(num)
```

### 装饰器

```python
import functools

def cache_decorator(func):
    """一个简单的缓存装饰器"""
    memo = {}
    @functools.wraps(func) # 保持原函数的元信息
    def wrapper(*args):
        if args not in memo:
            print(f"正在计算 {func.__name__}{args}...")
            memo[args] = func(*args)
        else:
            print(f"从缓存中获取 {func.__name__}{args}...")
        return memo[args]
    return wrapper

@cache_decorator
def fibonacci(n):
    if n < 2: return n
    return fibonacci(n-2) + fibonacci(n-1)

fibonacci(5)
fibonacci(5) # 第二次调用将从缓存中获取
```
