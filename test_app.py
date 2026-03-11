#!/usr/bin/env python3
"""
간단한 테스트 애플리케이션
DevBot이 생성한 테스트 코드
"""

def hello_world():
    """Hello World 메시지를 출력하는 함수"""
    return "Hello, World! from DevBot"

def add_numbers(a, b):
    """두 숫자를 더하는 함수"""
    return a + b

def main():
    """메인 함수"""
    print("=== 테스트 애플리케이션 ===")
    print(hello_world())
    print(f"1 + 2 = {add_numbers(1, 2)}")
    print(f"10 + 20 = {add_numbers(10, 20)}")
    print("테스트 완료!")

if __name__ == "__main__":
    main()
