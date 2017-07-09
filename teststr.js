

var query_test=`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; 
				BEGIN TRANSACTION;
				update [safet].[dbo].[profile] set name='`+"name"+`',number='`+"number"+`',age='`+"age"+
				`',email='`+"email"+`',pwd='`+"pwd"+`',msg='`+"msg"+`',blood='`+"blood"+`',sex='`+"sex"+
				`' where uid='`+"uid"+`';
				IF @@ROWCOUNT = 0
				BEGIN
				insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values 
				('`+"uid"+`','`+"name"+`','`+"number"+`','`+"age"+`','`+"email"+`','`
				+"pwd"+`','`+"msg"+`','`+"blood"+`','`+"sex"+`')
				END COMMIT TRANSACTION;`
console.log(query_test)




/*var query_test=`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;
        				update [safet].[dbo].[profile] set name='`+obj.name+`',number='`+obj.number+`',age='`+obj.age+`',email='`+obj.email+`',
        				pwd='`+obj.pwd+`',msg='`+obj.msg+`',blood='`+obj.blood+`',sex='`+obj.sex+`' where uid='`+"uid"+`';
						IF @@ROWCOUNT = 0
						BEGIN
						insert into [safet].[dbo].[profile] (uid,name,number,age,email,pwd,msg,blood,sex) values 
						('`+obj.uid+`','`+obj.name+`','`+obj.number+`','`+obj.age+`','`+obj.email+`','`
						+obj.pwd+`','`+obj.msg+`','`+obj.blood+`','`+obj.sex+`')
						END COMMIT TRANSACTION;`*/