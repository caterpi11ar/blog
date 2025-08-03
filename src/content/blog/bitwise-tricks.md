---
title: 位运算技巧
author: caterpillar
pubDatetime: 2025-01-27T00:00:00
featured: false
draft: false
tags:
  - 算法
  - 位运算
  - 编程技巧
  - 数据结构
description: 一份位运算技巧总结，包含基础操作、常用技巧、高级算法和实际应用场景
---

# 位运算技巧

## 目录

1. [基础位运算](#基础位运算)
2. [常用位运算技巧](#常用位运算技巧)
3. [位运算算法](#位运算算法)
4. [高级技巧](#高级技巧)
5. [实际应用](#实际应用)
6. [性能优化](#性能优化)

## 基础位运算

### 基本操作符

```python
# 按位与 (&)
a & b  # 两个位都为1时，结果才为1

# 按位或 (|)
a | b  # 两个位都为0时，结果才为0

# 按位异或 (^)
a ^ b  # 两个位相同时为0，不同时为1

# 按位取反 (~)
~a     # 对每一位取反

# 左移 (<<)
a << n # 将a的所有位向左移动n位

# 右移 (>>)
a >> n # 将a的所有位向右移动n位
```

### 位运算性质

```python
# 交换律
a & b = b & a
a | b = b | a
a ^ b = b ^ a

# 结合律
(a & b) & c = a & (b & c)
(a | b) | c = a | (b | c)
(a ^ b) ^ c = a ^ (b ^ c)

# 分配律
a & (b | c) = (a & b) | (a & c)
a | (b & c) = (a | b) & (a | c)

# 德摩根定律
~(a & b) = ~a | ~b
~(a | b) = ~a & ~b

# 异或的特殊性质
a ^ a = 0        # 任何数与自身异或为0
a ^ 0 = a        # 任何数与0异或为自身
a ^ b ^ b = a    # 异或的逆运算
```

## 常用位运算技巧

### 1. 判断奇偶性

```python
def is_even(n):
    return (n & 1) == 0

def is_odd(n):
    return (n & 1) == 1

# 示例
print(is_even(4))  # True
print(is_even(7))  # False
print(is_odd(4))   # False
print(is_odd(7))   # True
```

### 2. 判断是否为2的幂

```python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# 示例
print(is_power_of_two(1))   # True  (2^0)
print(is_power_of_two(2))   # True  (2^1)
print(is_power_of_two(4))   # True  (2^2)
print(is_power_of_two(8))   # True  (2^3)
print(is_power_of_two(3))   # False
print(is_power_of_two(6))   # False
```

**原理解释**：
- 2的幂次方在二进制中只有一个1，其余都是0
- `n & (n - 1)` 会清除最低位的1
- 如果n是2的幂，清除最低位1后应该为0

### 3. 获取最低位的1

```python
def get_lowest_set_bit(n):
    return n & (-n)

# 示例
print(bin(get_lowest_set_bit(12)))  # 0b100 (二进制12是1100，最低位1是100)
print(bin(get_lowest_set_bit(8)))   # 0b1000
```

### 4. 清除最低位的1

```python
def clear_lowest_set_bit(n):
    return n & (n - 1)

# 示例
print(bin(clear_lowest_set_bit(12)))  # 0b1000 (清除1100中的最低位1)
print(bin(clear_lowest_set_bit(8)))   # 0b0
```

### 5. 计算1的个数

```python
def count_set_bits(n):
    count = 0
    while n:
        count += 1
        n = n & (n - 1)  # 清除最低位的1
    return count

# 更高效的方法（查表法）
def count_set_bits_lookup(n):
    # 预计算0-255中每个数的1的个数
    lookup = [0] * 256
    for i in range(256):
        lookup[i] = (i & 1) + lookup[i >> 1]

    count = 0
    while n:
        count += lookup[n & 0xFF]
        n >>= 8
    return count

# 示例
print(count_set_bits(12))        # 2 (1100有2个1)
print(count_set_bits_lookup(12)) # 2
```

### 6. 判断是否为4的幂

```python
def is_power_of_four(n):
    return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0

# 示例
print(is_power_of_four(1))   # True  (4^0)
print(is_power_of_four(4))   # True  (4^1)
print(is_power_of_four(16))  # True  (4^2)
print(is_power_of_four(2))   # False
print(is_power_of_four(8))   # False
```

**原理解释**：
- 4的幂次方是2的幂次方，且1出现在偶数位置
- `0xAAAAAAAA` 的二进制是 `10101010...`，用于检查1是否在偶数位置

### 7. 交换两个数

```python
def swap_without_temp(a, b):
    a = a ^ b
    b = a ^ b  # b = (a ^ b) ^ b = a
    a = a ^ b  # a = (a ^ b) ^ a = b
    return a, b

# 示例
x, y = 5, 10
x, y = swap_without_temp(x, y)
print(x, y)  # 10, 5
```

### 8. 获取最高位的1

```python
def get_highest_set_bit(n):
    if n == 0:
        return 0

    # 方法1：逐步右移
    highest = 1
    while n >> 1:
        n >>= 1
        highest <<= 1
    return highest

# 方法2：使用对数
import math
def get_highest_set_bit_log(n):
    if n == 0:
        return 0
    return 1 << int(math.log2(n))

# 示例
print(bin(get_highest_set_bit(12)))     # 0b1000
print(bin(get_highest_set_bit_log(12))) # 0b1000
```

## 位运算算法

### 1. 汉明距离

```python
def hamming_distance(x, y):
    # 计算两个整数的汉明距离（不同位的个数）
    xor = x ^ y
    return count_set_bits(xor)

# 示例
print(hamming_distance(1, 4))  # 2 (1=001, 4=100，有2位不同)
```

### 2. 汉明重量

```python
def hamming_weight(n):
    # 计算一个数的汉明重量（1的个数）
    return count_set_bits(n)

# 示例
print(hamming_weight(12))  # 2 (1100有2个1)
```

### 3. 位反转

```python
def reverse_bits(n):
    # 反转32位整数的位
    result = 0
    for i in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

# 示例
print(bin(reverse_bits(43261596)))  # 0b11111111111111111111111111111101
```

### 4. 子集生成

```python
def generate_subsets(nums):
    # 使用位运算生成所有子集
    n = len(nums)
    subsets = []

    for i in range(1 << n):  # 2^n 种可能
        subset = []
        for j in range(n):
            if i & (1 << j):  # 检查第j位是否为1
                subset.append(nums[j])
        subsets.append(subset)

    return subsets

# 示例
nums = [1, 2, 3]
subsets = generate_subsets(nums)
print(subsets)  # [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

### 5. 格雷码生成

```python
def gray_code(n):
    # 生成n位格雷码
    result = []
    for i in range(1 << n):
        result.append(i ^ (i >> 1))
    return result

# 示例
print(gray_code(2))  # [0, 1, 3, 2]
print(gray_code(3))  # [0, 1, 3, 2, 6, 7, 5, 4]
```

### 6. 快速幂

```python
def fast_power(base, exponent):
    # 使用位运算的快速幂算法
    result = 1
    while exponent > 0:
        if exponent & 1:  # 检查最低位
            result *= base
        base *= base
        exponent >>= 1
    return result

# 示例
print(fast_power(2, 10))  # 1024
print(fast_power(3, 5))   # 243
```

## 高级技巧

### 1. 位图（Bitmap）

```python
class Bitmap:
    def __init__(self, size):
        self.size = size
        self.bits = [0] * ((size + 31) // 32)  # 每个int存储32位

    def set(self, pos):
        # 设置第pos位为1
        if pos < self.size:
            self.bits[pos // 32] |= (1 << (pos % 32))

    def clear(self, pos):
        # 清除第pos位
        if pos < self.size:
            self.bits[pos // 32] &= ~(1 << (pos % 32))

    def get(self, pos):
        # 获取第pos位的值
        if pos < self.size:
            return (self.bits[pos // 32] >> (pos % 32)) & 1
        return 0

    def count_ones(self):
        # 统计1的个数
        count = 0
        for num in self.bits:
            count += count_set_bits(num)
        return count

# 示例
bitmap = Bitmap(100)
bitmap.set(5)
bitmap.set(10)
print(bitmap.get(5))      # 1
print(bitmap.get(6))      # 0
print(bitmap.count_ones()) # 2
```

### 2. 状态压缩DP

```python
def tsp_bitmask(distances):
    # 旅行商问题的位运算解法
    n = len(distances)
    dp = [[float('inf')] * (1 << n) for _ in range(n)]

    # 初始化：从城市0开始
    dp[0][1] = 0  # 1表示只访问了城市0

    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue

            # 尝试从last城市到next城市
            for next_city in range(n):
                if mask & (1 << next_city):
                    continue

                new_mask = mask | (1 << next_city)
                dp[next_city][new_mask] = min(
                    dp[next_city][new_mask],
                    dp[last][mask] + distances[last][next_city]
                )

    # 返回回到起点的最短路径
    result = float('inf')
    for last in range(1, n):
        result = min(result, dp[last][(1 << n) - 1] + distances[last][0])

    return result

# 示例
distances = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
]
print(tsp_bitmask(distances))  # 80
```

### 3. 位运算优化

```python
# 快速判断是否为2的幂的倍数
def is_multiple_of_power_of_two(n, power):
    return (n & ((1 << power) - 1)) == 0

# 快速计算log2
def log2(n):
    if n == 0:
        return -1
    result = 0
    while n > 1:
        n >>= 1
        result += 1
    return result

# 快速计算下一个2的幂
def next_power_of_two(n):
    if n == 0:
        return 1
    n -= 1
    n |= n >> 1
    n |= n >> 2
    n |= n >> 4
    n |= n >> 8
    n |= n >> 16
    return n + 1

# 示例
print(is_multiple_of_power_of_two(16, 4))  # True
print(log2(16))                            # 4
print(next_power_of_two(10))               # 16
```

## 实际应用

### 1. 权限系统

```python
class Permission:
    READ = 1 << 0    # 0001
    WRITE = 1 << 1   # 0010
    DELETE = 1 << 2  # 0100
    ADMIN = 1 << 3   # 1000

class User:
    def __init__(self, permissions=0):
        self.permissions = permissions

    def has_permission(self, permission):
        return (self.permissions & permission) == permission

    def add_permission(self, permission):
        self.permissions |= permission

    def remove_permission(self, permission):
        self.permissions &= ~permission

    def get_permissions(self):
        perms = []
        if self.has_permission(Permission.READ):
            perms.append("READ")
        if self.has_permission(Permission.WRITE):
            perms.append("WRITE")
        if self.has_permission(Permission.DELETE):
            perms.append("DELETE")
        if self.has_permission(Permission.ADMIN):
            perms.append("ADMIN")
        return perms

# 示例
user = User()
user.add_permission(Permission.READ | Permission.WRITE)
print(user.has_permission(Permission.READ))   # True
print(user.has_permission(Permission.DELETE)) # False
print(user.get_permissions())                 # ['READ', 'WRITE']
```

### 2. 颜色操作

```python
class Color:
    def __init__(self, r, g, b, a=255):
        self.r = r
        self.g = g
        self.b = b
        self.a = a

    def to_int(self):
        # 将RGBA转换为32位整数
        return (self.a << 24) | (self.r << 16) | (self.g << 8) | self.b

    @classmethod
    def from_int(cls, color_int):
        # 从32位整数创建Color对象
        a = (color_int >> 24) & 0xFF
        r = (color_int >> 16) & 0xFF
        g = (color_int >> 8) & 0xFF
        b = color_int & 0xFF
        return cls(r, g, b, a)

    def blend(self, other, alpha):
        # 混合两个颜色
        inv_alpha = 1.0 - alpha
        r = int(self.r * inv_alpha + other.r * alpha)
        g = int(self.g * inv_alpha + other.g * alpha)
        b = int(self.b * inv_alpha + other.b * alpha)
        return Color(r, g, b)

# 示例
red = Color(255, 0, 0)
blue = Color(0, 0, 255)
color_int = red.to_int()
restored = Color.from_int(color_int)
blended = red.blend(blue, 0.5)
```

### 3. 网络编程

```python
def ip_to_int(ip):
    # 将IP地址转换为整数
    parts = ip.split('.')
    result = 0
    for part in parts:
        result = (result << 8) | int(part)
    return result

def int_to_ip(ip_int):
    # 将整数转换为IP地址
    parts = []
    for i in range(4):
        parts.append(str((ip_int >> (24 - i * 8)) & 0xFF))
    return '.'.join(parts)

def is_in_subnet(ip, network, mask):
    # 检查IP是否在指定子网内
    ip_int = ip_to_int(ip)
    network_int = ip_to_int(network)
    mask_int = ip_to_int(mask)

    return (ip_int & mask_int) == (network_int & mask_int)

# 示例
ip = "192.168.1.100"
network = "192.168.1.0"
mask = "255.255.255.0"
print(is_in_subnet(ip, network, mask))  # True
```

## 性能优化

### 1. 位运算 vs 算术运算

```python
import time

# 测试性能差异
def performance_test():
    n = 10000000

    # 测试奇偶性判断
    start = time.time()
    for i in range(n):
        is_even = i % 2 == 0
    mod_time = time.time() - start

    start = time.time()
    for i in range(n):
        is_even = (i & 1) == 0
    bit_time = time.time() - start

    print(f"模运算时间: {mod_time:.4f}秒")
    print(f"位运算时间: {bit_time:.4f}秒")
    print(f"性能提升: {mod_time/bit_time:.2f}倍")

# performance_test()
```

### 2. 内存优化

```python
# 使用位运算压缩存储
class CompressedArray:
    def __init__(self, size, bits_per_element):
        self.size = size
        self.bits_per_element = bits_per_element
        self.mask = (1 << bits_per_element) - 1
        self.data = [0] * ((size * bits_per_element + 31) // 32)

    def set(self, index, value):
        if index >= self.size or value > self.mask:
            raise ValueError("Invalid index or value")

        bit_pos = index * self.bits_per_element
        word_index = bit_pos // 32
        bit_offset = bit_pos % 32

        # 清除原有值
        self.data[word_index] &= ~(self.mask << bit_offset)
        # 设置新值
        self.data[word_index] |= (value << bit_offset)

        # 处理跨字边界的情况
        if bit_offset + self.bits_per_element > 32:
            remaining_bits = bit_offset + self.bits_per_element - 32
            self.data[word_index + 1] &= ~((1 << remaining_bits) - 1)
            self.data[word_index + 1] |= (value >> (self.bits_per_element - remaining_bits))

    def get(self, index):
        if index >= self.size:
            raise ValueError("Invalid index")

        bit_pos = index * self.bits_per_element
        word_index = bit_pos // 32
        bit_offset = bit_pos % 32

        value = (self.data[word_index] >> bit_offset) & self.mask

        # 处理跨字边界的情况
        if bit_offset + self.bits_per_element > 32:
            remaining_bits = bit_offset + self.bits_per_element - 32
            value |= (self.data[word_index + 1] & ((1 << remaining_bits) - 1)) << (self.bits_per_element - remaining_bits)

        return value

# 示例
arr = CompressedArray(10, 4)  # 10个元素，每个元素4位
arr.set(0, 5)
arr.set(1, 10)
print(arr.get(0))  # 5
print(arr.get(1))  # 10
```

## 总结

位运算技巧是编程中的重要工具，掌握这些技巧可以：

1. **提高性能**：位运算通常比算术运算更快
2. **节省内存**：使用位图等技巧可以大幅节省内存
3. **简化代码**：某些问题用位运算可以写出更简洁的代码
4. **解决特殊问题**：如状态压缩、权限系统等

### 关键要点

- **基础技巧**：奇偶性判断、2的幂判断、清除最低位1等
- **高级算法**：汉明距离、格雷码、快速幂等
- **实际应用**：权限系统、颜色操作、网络编程等
- **性能优化**：位运算比算术运算更快，内存使用更高效

### 练习建议

1. 实现一个完整的位图类
2. 使用位运算解决LeetCode上的位运算相关题目
3. 设计一个基于位运算的权限系统
4. 优化现有代码中的算术运算为位运算

记住，位运算虽然强大，但也要注意代码的可读性。在性能不是关键因素的情况下，优先选择可读性更好的代码。
