'''
空投中奖查询名单脚本, 本地极速版

1. 新建、编辑 my_address.txt 文件, 用于保存自己的钱包地址
每行格式: 地址,分组备注
其中分组备注可以不用填

2. 新建、编辑 allowlist_address.txt 文件,用于保存白名单地址
每行格式: 地址,空投币数量
其中空投币数量可以不用填

3. 运行
会输出 中奖的钱包地址,所在分组,空投代币数量信息
内容保存成csv文件,然后在excel做分组统计

本地查询的最大优点是快, 另不怕被人收集钱包信息

by @gggxin

'''

from os.path import dirname, realpath


# 自己的钱包地址
# 格式: 地址,分组备注
my_address_file = 'my_address.txt'


# 白名单地址
# 格式: 地址,数量
# allowlist_address_file = dirname(dirname(realpath(__file__)))+'/data/allowlist_address.txt'
allowlist_address_file = 'allowlist_address.txt'

# 地址最小允许长度
min_address_len = 3

my_address_lines = []


with open(my_address_file,encoding='utf-8') as file_object:
	for curr_line in file_object:
		if len(curr_line) <= min_address_len:
			continue
		curr_line = curr_line.split(',')
		tmp_row = {'address' : curr_line[0].lower().strip(), 'remark': ''}

		if len(curr_line) > 1:
			tmp_row['remark'] = curr_line[1].strip()

		# print(tmp_row)
		my_address_lines.append(tmp_row)

# print(my_address_lines)

allowlist_address_dict = {}
with open(allowlist_address_file,encoding='utf-8') as file_object:
	for curr_line in file_object:
		curr_line = curr_line.split(',')
		tmp_address = curr_line[0].lower().strip()
		if tmp_address in allowlist_address_dict:
			continue

		tmp_row = {'address' : curr_line[0], 'amount': 0}
		if len(curr_line) > 1:
			tmp_row['amount'] = curr_line[1].strip()
		allowlist_address_dict[tmp_address] = tmp_row

for curr_line in my_address_lines:
	curr_address = curr_line['address']
	# print(curr_line)
	curr_remark = curr_line['remark']
	if curr_address in allowlist_address_dict:
		curr_amount = allowlist_address_dict[curr_address]['amount']
		print(f"{curr_address},{curr_remark},{curr_amount}")
		# break



print('\n----\nend\n by @gggxin')
quit()
